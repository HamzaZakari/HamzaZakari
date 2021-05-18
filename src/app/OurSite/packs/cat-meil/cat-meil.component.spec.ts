import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMeilComponent } from './cat-meil.component';

describe('CatMeilComponent', () => {
  let component: CatMeilComponent;
  let fixture: ComponentFixture<CatMeilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMeilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMeilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
