import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeEvenementComboComponent } from './theme-evenement-combo.component';

describe('ThemeEvenementComboComponent', () => {
  let component: ThemeEvenementComboComponent;
  let fixture: ComponentFixture<ThemeEvenementComboComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeEvenementComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
