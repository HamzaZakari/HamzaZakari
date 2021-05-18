import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatBeldiComponent } from './cat-beldi.component';

describe('CatBeldiComponent', () => {
  let component: CatBeldiComponent;
  let fixture: ComponentFixture<CatBeldiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatBeldiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatBeldiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
