/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonNavComponent } from './button-nav.component';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { NavMenuButtonComponent } from '../nav-menu-button/nav-menu-button.component';
import { ButtonNav } from '../../models/buttonNav';

@Component({
  selector: 'lucide-icon',
  template: `<span [attr.data-testid]="'mock-icon-' + icon">{{ icon }}</span>`,
  standalone: true,
})
class MockLucideIcon {
  @Input() icon!: string;
  @Input() size?: number;
  @Input() strokeWidth?: number;
  @Input() img?: string;
  @Input() class?: string;
  @Input() color?: string;
}

@Component({
  selector: 'app-nav-menu-button',
  template: `<div data-testid="nav-menu">{{ button?.label }}</div>`,
  standalone: true,
})
class MockNavMenuButtonComponent {
  @Input() button?: ButtonNav;
}

describe('ButtonNavComponent', () => {
  let component: ButtonNavComponent;
  let fixture: ComponentFixture<ButtonNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonNavComponent],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
    })
      .overrideComponent(ButtonNavComponent, {
        remove: {
          imports: [LucideAngularModule, NavMenuButtonComponent],
        },
        add: {
          imports: [MockLucideIcon, MockNavMenuButtonComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ButtonNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should render good semantic structure with ul and li elements', () => {
    fixture.componentRef.setInput('buttons', [
      { label: 'Home', icon: 'home', path: '/home' },
      { label: 'Profile', icon: 'user', path: '/profile' },
      { label: 'Action', icon: 'star', action: jasmine.createSpy() },
    ]);
    fixture.detectChanges();

    const ulElement = fixture.debugElement.query(By.css('ul'));
    expect(ulElement).toBeDefined();

    const listItems = fixture.debugElement.queryAll(By.css('ul > li'));
    expect(listItems.length).toBe(3);

    listItems.forEach((listItem) => {
      expect(listItem.nativeElement.tagName.toLowerCase()).toBe('li');

      const link = listItem.query(By.css('a'));
      expect(link).toBeDefined();

      const icon = link.query(By.css('lucide-icon'));
      const text = link.query(By.css('span'));
      expect(icon).toBeDefined();
      expect(text).toBeDefined();
    });
  });

  it('should render a nav menu button when button has menuList', () => {
    fixture.componentRef.setInput('buttons', [
      { label: 'Menu', icon: {} as MockLucideIcon, menuList: [] },
    ]);
    fixture.detectChanges();

    const menuBtn = fixture.debugElement.query(By.directive(MockNavMenuButtonComponent));
    expect(menuBtn).toBeDefined();
  });

  it('should call action when button with action is clicked', () => {
    const actionSpy = jasmine.createSpy('actionSpy');
    fixture.componentRef.setInput('buttons', [
      { label: 'ClickMe', icon: 'star', action: actionSpy },
    ]);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('a'));
    button.triggerEventHandler('click');
    expect(actionSpy).toHaveBeenCalled();
  });

  it('should render nothing when buttons is empty', () => {
    fixture.componentRef.setInput('buttons', []);
    fixture.detectChanges();

    const ulElement = fixture.debugElement.query(By.css('ul'));
    expect(ulElement).toBeDefined();

    const listItems = fixture.debugElement.queryAll(By.css('li'));
    expect(listItems.length).toBe(0);
  });
});
