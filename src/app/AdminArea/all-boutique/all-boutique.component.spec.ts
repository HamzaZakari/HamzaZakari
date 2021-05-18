import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBoutiqueComponent } from './all-boutique.component';

describe('AllBoutiqueComponent', () => {
  let component: AllBoutiqueComponent;
  let fixture: ComponentFixture<AllBoutiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllBoutiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllBoutiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
