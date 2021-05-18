import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResPacksComponent } from './res-packs.component';

describe('ResPacksComponent', () => {
  let component: ResPacksComponent;
  let fixture: ComponentFixture<ResPacksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResPacksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
