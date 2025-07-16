import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavMenuButtonComponent } from './nav-menu-button.component';

describe('NavMenuButtonComponent', () => {
  let component: NavMenuButtonComponent;
  let fixture: ComponentFixture<NavMenuButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavMenuButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavMenuButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
