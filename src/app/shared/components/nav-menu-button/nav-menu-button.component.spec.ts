import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Menu } from 'lucide-angular';

import { NavMenuButtonComponent } from './nav-menu-button.component';

describe('NavMenuButtonComponent', () => {
  let component: NavMenuButtonComponent;
  let fixture: ComponentFixture<NavMenuButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavMenuButtonComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavMenuButtonComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('button', {
      label: 'Test Menu',
      icon: Menu,
      menuList: [],
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
