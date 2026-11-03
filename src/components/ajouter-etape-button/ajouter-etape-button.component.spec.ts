import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterEtapeButtonComponent } from './ajouter-etape-button.component';

describe('AjouterEtapeButtonComponent', () => {
  let component: AjouterEtapeButtonComponent;
  let fixture: ComponentFixture<AjouterEtapeButtonComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterEtapeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
