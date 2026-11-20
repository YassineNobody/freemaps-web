import { Injectable } from '@angular/core';
import { Map as MapLibre, setWorkerUrl } from 'maplibre-gl';

setWorkerUrl('/maplibre-gl-worker.mjs');

type Coord = {
  long: number;
  lat: number;
};

const URL_STYLE_MAP = 'https://tiles.openfreemap.org/styles/liberty';

@Injectable()
export class MapService {
  private map: MapLibre | null = null;

  setMapLanguage(language: string = 'fr'): void {
    if (!this.map) return;

    const layers = this.map.getStyle().layers ?? [];

    for (const layer of layers) {
      if (layer.type !== 'symbol') continue;
      if (!layer.layout?.['text-field']) continue;

      this.map.setLayoutProperty(layer.id, 'text-field', [
        'coalesce',
        ['get', `name:${language}`],
        ['get', 'name:latin'],
        ['get', 'name'],
      ]);
    }
  }

  createMap(container: HTMLElement, coord: Coord = { long: 2.3522, lat: 48.8566 }): void {
    this.destroyMap();
    this.map = new MapLibre({
      container,
      style: URL_STYLE_MAP,
      center: [coord.long, coord.lat],
      zoom: 12,
      minZoom: 1,
      maxZoom: 18,
    });
    this.map.on('load', () => {
      this.setMapLanguage('fr');
    });
  }

  getMap(): MapLibre | null {
    return this.map;
  }

  destroyMap(): void {
    this.map?.remove();
    this.map = null;
  }
}
