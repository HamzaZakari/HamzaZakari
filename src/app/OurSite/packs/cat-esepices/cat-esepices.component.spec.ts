import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatEsepicesComponent } from './cat-esepices.component';

describe('CatEsepicesComponent', () => {
  let component: CatEsepicesComponent;
  let fixture: ComponentFixture<CatEsepicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatEsepicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatEsepicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
