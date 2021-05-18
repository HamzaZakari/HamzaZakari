import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResPharmacieComponent } from './res-pharmacie.component';

describe('ResPharmacieComponent', () => {
  let component: ResPharmacieComponent;
  let fixture: ComponentFixture<ResPharmacieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResPharmacieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResPharmacieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
