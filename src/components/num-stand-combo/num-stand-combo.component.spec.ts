import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumStandComboComponent } from './num-stand-combo.component';

describe('NumStandComboComponent', () => {
  let component: NumStandComboComponent;
  let fixture: ComponentFixture<NumStandComboComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NumStandComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
