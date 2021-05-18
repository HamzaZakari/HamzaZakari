import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResOliverCornichonComponent } from './res-oliver-cornichon.component';

describe('ResOliverCornichonComponent', () => {
  let component: ResOliverCornichonComponent;
  let fixture: ComponentFixture<ResOliverCornichonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResOliverCornichonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResOliverCornichonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
