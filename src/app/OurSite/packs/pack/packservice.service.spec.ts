import { TestBed } from '@angular/core/testing';

import { PackserviceService } from './packservice.service';

describe('PackserviceService', () => {
  let service: PackserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
