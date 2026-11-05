import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageConfigPlanPage } from './page-config-plan.page';

describe('PageConfigPlanPage', () => {
  let component: PageConfigPlanPage;
  let fixture: ComponentFixture<PageConfigPlanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PageConfigPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
