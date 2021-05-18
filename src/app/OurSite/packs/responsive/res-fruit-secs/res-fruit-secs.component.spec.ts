import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResFruitSecsComponent } from './res-fruit-secs.component';

describe('ResFruitSecsComponent', () => {
  let component: ResFruitSecsComponent;
  let fixture: ComponentFixture<ResFruitSecsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResFruitSecsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResFruitSecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
