import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanHallComponent } from './plan-hall.component';

describe('PlanHallComponent', () => {
  let component: PlanHallComponent;
  let fixture: ComponentFixture<PlanHallComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanHallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
