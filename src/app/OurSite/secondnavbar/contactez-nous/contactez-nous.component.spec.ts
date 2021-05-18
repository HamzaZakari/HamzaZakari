import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactezNousComponent } from './contactez-nous.component';

describe('ContactezNousComponent', () => {
  let component: ContactezNousComponent;
  let fixture: ComponentFixture<ContactezNousComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactezNousComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactezNousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
