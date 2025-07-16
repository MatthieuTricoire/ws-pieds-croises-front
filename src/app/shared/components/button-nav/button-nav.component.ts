import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonNav } from '../../models/buttonNav';
import { LucideAngularModule } from 'lucide-angular';
import { NavMenuButtonComponent } from '../nav-menu-button/nav-menu-button.component';

@Component({
  selector: 'app-button-nav',
  imports: [RouterLink, LucideAngularModule, NavMenuButtonComponent, RouterLinkActive],
  templateUrl: './button-nav.component.html',
  styleUrl: './button-nav.component.css',
})
export class ButtonNavComponent {
  route: ActivatedRoute = inject(ActivatedRoute);

  buttons = input<ButtonNav[]>([]);
}
