import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagePlanningPersonnelPage } from './page-planning-personnel.page';

describe('PagePlanningPersonnelPage', () => {
  let component: PagePlanningPersonnelPage;
  let fixture: ComponentFixture<PagePlanningPersonnelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePlanningPersonnelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
