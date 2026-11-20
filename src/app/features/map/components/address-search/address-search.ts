import { Component, inject, signal } from '@angular/core';
import { AddressService } from '../../services/address';
import { AddressFeature } from '../../models/address.model';

@Component({
  selector: 'app-address-search',
  templateUrl: './address-search.html',
  styleUrl: './address-search.scss',
})
export class AddressSearch {
  private readonly addressService = inject(AddressService);

  readonly query = signal('');
  readonly addresses = signal<AddressFeature[]>([]);
  readonly loading = signal(false);

  search(): void {
    const query = this.query().trim();

    if (!query) {
      this.addresses.set([]);
      return;
    }

    this.loading.set(true);

    this.addressService.search(query).subscribe({
      next: (response) => {
        this.addresses.set(response.features);
      },
      error: (error) => {
        console.error('Erreur de géocodage :', error);
        this.addresses.set([]);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }
}
