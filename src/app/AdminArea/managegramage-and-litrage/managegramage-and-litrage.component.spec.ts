import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagegramageAndLitrageComponent } from './managegramage-and-litrage.component';

describe('ManagegramageAndLitrageComponent', () => {
  let component: ManagegramageAndLitrageComponent;
  let fixture: ComponentFixture<ManagegramageAndLitrageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagegramageAndLitrageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagegramageAndLitrageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
