import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFornisseurComponent } from './add-fornisseur.component';

describe('AddFornisseurComponent', () => {
  let component: AddFornisseurComponent;
  let fixture: ComponentFixture<AddFornisseurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFornisseurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFornisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
