
import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMapPin } from '@ng-icons/heroicons/outline';

import { AddressFeature } from '../../models/address.model';

@Component({
  selector: 'app-search-results',
  imports: [NgIcon],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
  providers: [provideIcons({ heroMapPin })],
})
export class SearchResults {
  readonly results = input.required<AddressFeature[]>();
}
