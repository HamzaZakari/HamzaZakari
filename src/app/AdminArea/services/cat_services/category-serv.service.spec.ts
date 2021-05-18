import { TestBed } from '@angular/core/testing';

import { CategoryServService } from './category-serv.service';

describe('CategoryServService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CategoryServService = TestBed.get(CategoryServService);
    expect(service).toBeTruthy();
  });
});
