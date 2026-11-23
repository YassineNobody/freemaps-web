import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Map } from './map';
import { MapView } from './components/map-view/map-view';
import { AddressFeature } from './models/address.model';

@Component({ selector: 'app-map-view', template: '' })
class MapViewStub {}

const address: AddressFeature = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [2.35, 48.85] },
  properties: { label: 'Paris', name: 'Paris', city: 'Paris' },
};

describe('Map panel', () => {
  let component: Map;
  let fixture: ComponentFixture<Map>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Map],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).overrideComponent(Map, {
      remove: { imports: [MapView] },
      add: { imports: [MapViewStub] },
    }).compileComponents();
    fixture = TestBed.createComponent(Map);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('starts closed, renders submitted results in the common panel, and closes', async () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(component.activePanelView()).toBeNull();
    expect(host.querySelector('app-side-panel')).toBeNull();

    component.onSearchSubmitted([address]);
    await fixture.whenStable();
    expect(component.activePanelView()).toBe('search');
    expect(host.querySelector('app-side-panel app-search-results')?.textContent).toContain('Paris');
    expect(host.querySelector('.results-count')?.textContent).toContain('1 résultat');

    host.querySelector<HTMLButtonElement>('app-address-search button[aria-label="Fermer les résultats"]')?.click();
    await fixture.whenStable();
    expect(component.activePanelView()).toBeNull();
    expect(host.querySelector('app-side-panel')).toBeNull();
  });

  it('opens the empty results view for an empty response', async () => {
    component.onSearchSubmitted([]);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.empty-results')?.textContent).toContain('Aucun résultat trouvé.');
  });
});
