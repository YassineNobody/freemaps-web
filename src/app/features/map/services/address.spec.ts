import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AddressService } from './address';

describe('AddressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('calls the French geocoding API with the query and limit', () => {
    const http = TestBed.inject(HttpTestingController);
    TestBed.inject(AddressService).search('Paris').subscribe();
    const request = http.expectOne((req) => req.url === 'https://data.geopf.fr/geocodage/search');
    expect(request.request.params.get('q')).toBe('Paris');
    expect(request.request.params.get('limit')).toBe('5');
    request.flush({ type: 'FeatureCollection', features: [] });
    http.verify();
  });
});
