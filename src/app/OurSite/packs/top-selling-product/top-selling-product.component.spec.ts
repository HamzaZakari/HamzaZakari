import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSellingProductComponent } from './top-selling-product.component';

describe('TopSellingProductComponent', () => {
  let component: TopSellingProductComponent;
  let fixture: ComponentFixture<TopSellingProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopSellingProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopSellingProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
