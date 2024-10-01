import { TestBed } from '@angular/core/testing';

import { SoleService } from './sole.service';

describe('SoleService', () => {
  let service: SoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
