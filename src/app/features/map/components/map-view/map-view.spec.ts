import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapService } from '../../services/map.service';
import { MapView } from './map-view';

describe('MapView', () => {
  let component: MapView;
  let fixture: ComponentFixture<MapView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapView],
    }).overrideComponent(MapView, {
      set: { providers: [{ provide: MapService, useValue: { createMap: vi.fn(), destroyMap: vi.fn() } }] },
    }).compileComponents();

    fixture = TestBed.createComponent(MapView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
