import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimerordersComponent } from './imprimerorders.component';

describe('ImprimerordersComponent', () => {
  let component: ImprimerordersComponent;
  let fixture: ComponentFixture<ImprimerordersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImprimerordersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprimerordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
