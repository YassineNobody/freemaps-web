import { Component, AfterViewInit, OnDestroy, inject, viewChild, ElementRef } from '@angular/core';
import { MapService } from '../../services/map.service';

@Component({
  imports: [],
  selector: 'app-map-view',
  styleUrl: './map-view.scss',
  templateUrl: './map-view.html',
  providers: [MapService],
})
export class MapView implements AfterViewInit, OnDestroy {
  private readonly mapService = inject(MapService);

  private readonly mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  ngAfterViewInit(): void {
    this.mapService.createMap(this.mapContainer().nativeElement);
  }

  ngOnDestroy(): void {
    this.mapService.destroyMap();
  }
}
