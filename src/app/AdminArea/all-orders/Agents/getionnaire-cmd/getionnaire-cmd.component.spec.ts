import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetionnaireCMDComponent } from './getionnaire-cmd.component';

describe('GetionnaireCMDComponent', () => {
  let component: GetionnaireCMDComponent;
  let fixture: ComponentFixture<GetionnaireCMDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetionnaireCMDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetionnaireCMDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
