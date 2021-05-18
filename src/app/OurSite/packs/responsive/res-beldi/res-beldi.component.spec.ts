import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResBeldiComponent } from './res-beldi.component';

describe('ResBeldiComponent', () => {
  let component: ResBeldiComponent;
  let fixture: ComponentFixture<ResBeldiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResBeldiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResBeldiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
