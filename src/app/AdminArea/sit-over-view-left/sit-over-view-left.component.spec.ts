import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitOverViewLeftComponent } from './sit-over-view-left.component';

describe('SitOverViewLeftComponent', () => {
  let component: SitOverViewLeftComponent;
  let fixture: ComponentFixture<SitOverViewLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitOverViewLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitOverViewLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
