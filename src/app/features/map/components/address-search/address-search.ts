import {
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { catchError, finalize, map, of, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass, heroXMark } from '@ng-icons/heroicons/outline';

import { AddressService } from '../../services/address';
import { AddressFeature } from '../../models/address.model';
import { SearchSuggestions } from '../search-suggestions/search-suggestions';

@Component({
  selector: 'app-address-search',
  imports: [NgIcon, SearchSuggestions],
  templateUrl: './address-search.html',
  styleUrl: './address-search.scss',
  providers: [provideIcons({ heroMagnifyingGlass, heroXMark })],
})
export class AddressSearch {
  private readonly addressService = inject(AddressService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  // Flux internes
  private readonly queryChanges = new Subject<string>();
  private readonly searchRequests = new Subject<string>();
  private readonly cancelSearchRequests = new Subject<void>();

  // Communication avec Map
  readonly isPanelOpen = input(false);
  readonly searchSubmitted = output<AddressFeature[]>();
  readonly closeRequested = output<void>();

  // Recherche
  readonly query = signal('');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Suggestions
  readonly suggestions = signal<AddressFeature[]>([]);
  readonly showSuggestions = signal(false);
  readonly activeSuggestionIndex = signal(-1);

  // Cache des suggestions
  private suggestionsQuery = '';

  constructor() {
    this.initSuggestions();
    this.initSearch();
  }

  private initSuggestions(): void {
    this.queryChanges
      .pipe(
        switchMap((query) => {
          const normalizedQuery = query.trim();

          if (normalizedQuery.length < 3) {
            return of<AddressFeature[]>([]);
          }

          return timer(300).pipe(
            switchMap(() =>
              this.addressService.search(normalizedQuery).pipe(
                map((response) => response.features),
                catchError((error) => {
                  console.error('Erreur des suggestions :', error);
                  return of<AddressFeature[]>([]);
                }),
              ),
            ),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((suggestions) => {
        if (this.showSuggestions()) {
          this.suggestions.set(suggestions);
          this.suggestionsQuery = this.query().trim();
          this.activeSuggestionIndex.set(-1);
        }
      });
  }

  private initSearch(): void {
    this.searchRequests
      .pipe(
        switchMap((query) => {
          this.loading.set(true);
          this.error.set(null);

          return this.addressService.search(query).pipe(
            map((response) => ({
              results: response.features,
              error: null as string | null,
            })),
            catchError((error) => {
              console.error('Erreur de géocodage :', error);

              return of({
                results: null,
                error: 'Impossible de rechercher cette adresse. Réessaie plus tard.',
              });
            }),
            takeUntil(this.cancelSearchRequests),
            finalize(() => {
              this.loading.set(false);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ results, error }) => {
        if (error) {
          this.error.set(error);
          return;
        }

        if (results !== null) {
          this.searchSubmitted.emit(results);
        }
      });
  }

  private cancelPendingRequests(): void {
    this.cancelSearchRequests.next();
    this.queryChanges.next('');

    this.showSuggestions.set(false);
    this.suggestions.set([]);
    this.suggestionsQuery = '';
    this.activeSuggestionIndex.set(-1);
  }

  onQueryChange(value: string): void {
    this.cancelSearchRequests.next();

    this.query.set(value);
    this.error.set(null);

    this.suggestions.set([]);
    this.suggestionsQuery = '';
    this.activeSuggestionIndex.set(-1);

    this.showSuggestions.set(value.trim().length >= 3);
    this.queryChanges.next(value);
  }

  onFocus(): void {
    const query = this.query().trim();

    if (query.length < 3) return;

    this.showSuggestions.set(true);

    if (this.suggestionsQuery === query) {
      return;
    }

    this.queryChanges.next(query);
  }

  onKeydown(event: KeyboardEvent): void {
    const suggestions = this.suggestions();

    if (event.key === 'Escape') {
      this.hideSuggestions();
      return;
    }

    if (!this.showSuggestions() || suggestions.length === 0) {
      if (event.key === 'Enter') {
        this.search();
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      this.activeSuggestionIndex.update((index) => (index + 1) % suggestions.length);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      this.activeSuggestionIndex.update((index) =>
        index <= 0 ? suggestions.length - 1 : index - 1,
      );
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      const index = this.activeSuggestionIndex();

      if (index >= 0) {
        this.selectSuggestion(suggestions[index]);
      } else {
        this.search();
      }
    }
  }

  private hideSuggestions(): void {
    this.showSuggestions.set(false);
    this.activeSuggestionIndex.set(-1);

    // L'émission annule immédiatement le timer ou la requête
    // via switchMap, sans vider les suggestions conservées.
    this.queryChanges.next('');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.hideSuggestions();
    }
  }

  selectSuggestion(address: AddressFeature): void {
    this.cancelPendingRequests();

    this.query.set(address.properties.label);
    this.searchSubmitted.emit([address]);
  }

  search(): void {
    const query = this.query().trim();

    this.cancelPendingRequests();
    this.error.set(null);

    if (!query) return;

    this.searchRequests.next(query);
  }

  closeSearch(): void {
    this.cancelPendingRequests();

    this.query.set('');
    this.error.set(null);

    this.closeRequested.emit();
  }
}
