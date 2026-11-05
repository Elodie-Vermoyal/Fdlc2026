import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageConfigPage } from './page-config.page';

describe('PageConfigPage', () => {
  let component: PageConfigPage;
  let fixture: ComponentFixture<PageConfigPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PageConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
