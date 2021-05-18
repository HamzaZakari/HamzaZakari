import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatFruitSecsComponent } from './cat-fruit-secs.component';

describe('CatFruitSecsComponent', () => {
  let component: CatFruitSecsComponent;
  let fixture: ComponentFixture<CatFruitSecsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatFruitSecsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatFruitSecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
