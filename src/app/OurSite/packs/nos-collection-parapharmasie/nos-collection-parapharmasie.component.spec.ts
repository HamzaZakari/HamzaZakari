import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NosCollectionParapharmasieComponent } from './nos-collection-parapharmasie.component';

describe('NosCollectionParapharmasieComponent', () => {
  let component: NosCollectionParapharmasieComponent;
  let fixture: ComponentFixture<NosCollectionParapharmasieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NosCollectionParapharmasieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NosCollectionParapharmasieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
