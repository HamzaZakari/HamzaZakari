import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapOrdersComponent } from './recap-orders.component';

describe('RecapOrdersComponent', () => {
  let component: RecapOrdersComponent;
  let fixture: ComponentFixture<RecapOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecapOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecapOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
