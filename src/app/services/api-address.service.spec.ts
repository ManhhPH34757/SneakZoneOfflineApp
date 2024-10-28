import { TestBed } from '@angular/core/testing';

import { ApiAddressService } from './api-address.service';

describe('ApiAddressService', () => {
  let service: ApiAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
