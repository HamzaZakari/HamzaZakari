import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamaTestComponent } from './dama-test.component';

describe('DamaTestComponent', () => {
  let component: DamaTestComponent;
  let fixture: ComponentFixture<DamaTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamaTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamaTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
