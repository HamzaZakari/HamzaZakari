import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddboutiqueComponent } from './addboutique.component';

describe('AddboutiqueComponent', () => {
  let component: AddboutiqueComponent;
  let fixture: ComponentFixture<AddboutiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddboutiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddboutiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
