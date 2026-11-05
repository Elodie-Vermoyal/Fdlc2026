import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExposantCardComponent } from './exposant-card.component';

describe('ExposantCardComponent', () => {
  let component: ExposantCardComponent;
  let fixture: ComponentFixture<ExposantCardComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExposantCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
