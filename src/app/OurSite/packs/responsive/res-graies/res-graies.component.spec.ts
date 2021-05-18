import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResGraiesComponent } from './res-graies.component';

describe('ResGraiesComponent', () => {
  let component: ResGraiesComponent;
  let fixture: ComponentFixture<ResGraiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResGraiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResGraiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
