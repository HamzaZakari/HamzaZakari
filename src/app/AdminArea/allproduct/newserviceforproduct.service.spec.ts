import { TestBed } from '@angular/core/testing';

import { NewserviceforproductService } from './newserviceforproduct.service';

describe('NewserviceforproductService', () => {
  let service: NewserviceforproductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewserviceforproductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
