import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatGrainesComponent } from './cat-graines.component';

describe('CatGrainesComponent', () => {
  let component: CatGrainesComponent;
  let fixture: ComponentFixture<CatGrainesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatGrainesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatGrainesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
