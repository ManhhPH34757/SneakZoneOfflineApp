import { TestBed } from '@angular/core/testing';

import { ProductDetailsSaleService } from './product-details-sale.service';

describe('ProductDetailsSaleService', () => {
  let service: ProductDetailsSaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductDetailsSaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
