import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AddressCollection } from '../models/address.model';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://data.geopf.fr/geocodage/search';

  search(query: string): Observable<AddressCollection> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', '5');

    return this.http.get<AddressCollection>(this.apiUrl, { params });
  }
}
