import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickViewsComponent } from './quick-views.component';

describe('QuickViewsComponent', () => {
  let component: QuickViewsComponent;
  let fixture: ComponentFixture<QuickViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickViewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
