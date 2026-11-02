import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagePersonnePage } from './page-personne.page';

describe('PagePersonnePage', () => {
  let component: PagePersonnePage;
  let fixture: ComponentFixture<PagePersonnePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePersonnePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
