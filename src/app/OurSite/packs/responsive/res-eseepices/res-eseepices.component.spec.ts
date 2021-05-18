import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResEseepicesComponent } from './res-eseepices.component';

describe('ResEseepicesComponent', () => {
  let component: ResEseepicesComponent;
  let fixture: ComponentFixture<ResEseepicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResEseepicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResEseepicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
