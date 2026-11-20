import { Component } from '@angular/core';
import { MapView } from './components/map-view/map-view';
import { AddressSearch } from './components/address-search/address-search';

@Component({
  selector: 'app-map',
  imports: [MapView, AddressSearch],
  styleUrl: './map.scss',
  templateUrl: './map.html',
})
export class Map {}
