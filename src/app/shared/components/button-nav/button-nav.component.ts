import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonNav } from '../../models/buttonNav';
import { LucideAngularModule } from 'lucide-angular';
import { NavMenuButtonComponent } from '../nav-menu-button/nav-menu-button.component';

@Component({
  selector: 'app-button-nav',
  imports: [RouterLink, LucideAngularModule, NavMenuButtonComponent, RouterLinkActive],
  templateUrl: './button-nav.component.html',
})
export class ButtonNavComponent {
  buttons = input<ButtonNav[]>([]);
}
