import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageConfigEvenementPage } from './page-config-evenement.page';

describe('PageConfigEvenementPage', () => {
  let component: PageConfigEvenementPage;
  let fixture: ComponentFixture<PageConfigEvenementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PageConfigEvenementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
