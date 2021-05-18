import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellesComponent } from './selles.component';

describe('SellesComponent', () => {
  let component: SellesComponent;
  let fixture: ComponentFixture<SellesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
