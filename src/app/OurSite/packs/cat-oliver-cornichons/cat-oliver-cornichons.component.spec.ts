import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatOliverCornichonsComponent } from './cat-oliver-cornichons.component';

describe('CatOliverCornichonsComponent', () => {
  let component: CatOliverCornichonsComponent;
  let fixture: ComponentFixture<CatOliverCornichonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatOliverCornichonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatOliverCornichonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
