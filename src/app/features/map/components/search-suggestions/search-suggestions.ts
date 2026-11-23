import { Component, input, output } from '@angular/core';
import { AddressFeature } from '../../models/address.model';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMapPin } from '@ng-icons/heroicons/outline';

@Component({
  imports: [NgIcon],
  selector: 'app-search-suggestions',
  styleUrl: './search-suggestions.scss',
  templateUrl: './search-suggestions.html',
  providers: [provideIcons({ heroMapPin })],
})
export class SearchSuggestions {
  readonly suggestions = input.required<AddressFeature[]>();
  readonly activeIndex = input(-1);

  readonly suggestionSelected = output<AddressFeature>();
}
