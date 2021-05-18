import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherUserAuthComponent } from './other-user-auth.component';

describe('OtherUserAuthComponent', () => {
  let component: OtherUserAuthComponent;
  let fixture: ComponentFixture<OtherUserAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherUserAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherUserAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
