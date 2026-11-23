import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AddressSearch } from './address-search';

describe('AddressSearch', () => {
  let component: AddressSearch;
  let fixture: ComponentFixture<AddressSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressSearch],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
