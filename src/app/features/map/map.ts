import { Component, computed, signal } from '@angular/core';
import { MapView } from './components/map-view/map-view';
import { AddressSearch } from './components/address-search/address-search';
import { SidePanel } from './components/side-panel/side-panel';
import { SearchResults } from './components/search-results/search-results';
import { AddressFeature } from './models/address.model';

export type PanelView = 'search' | 'place' | 'route' | null;

@Component({
  selector: 'app-map',
  imports: [MapView, AddressSearch, SidePanel, SearchResults],
  styleUrl: './map.scss',
  templateUrl: './map.html',
})
export class Map {
  readonly activePanelView = signal<PanelView>(null);
  readonly isPanelOpen = computed(() => this.activePanelView() !== null);
  readonly searchResults = signal<AddressFeature[]>([]);

  onSearchSubmitted(results: AddressFeature[]): void {
    this.searchResults.set(results);
    this.activePanelView.set('search');
  }

  closePanel(): void {
    this.activePanelView.set(null);
  }
}
