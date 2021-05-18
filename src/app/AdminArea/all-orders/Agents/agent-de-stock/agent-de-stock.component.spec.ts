import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDeStockComponent } from './agent-de-stock.component';

describe('AgentDeStockComponent', () => {
  let component: AgentDeStockComponent;
  let fixture: ComponentFixture<AgentDeStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentDeStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentDeStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
