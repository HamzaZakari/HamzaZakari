import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitOverViewRightComponent } from './sit-over-view-right.component';

describe('SitOverViewRightComponent', () => {
  let component: SitOverViewRightComponent;
  let fixture: ComponentFixture<SitOverViewRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitOverViewRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitOverViewRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
