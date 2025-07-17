import { Component, inject, input, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonNav } from '../../models/buttonNav';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-nav-menu-button',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './nav-menu-button.component.html',
  styleUrl: './nav-menu-button.component.css',
})
export class NavMenuButtonComponent {
  route: ActivatedRoute = inject(ActivatedRoute);

  isOpen = signal(false);

  toggleDetails(): void {
    this.isOpen.update((open) => !open);
  }

  closeDetails(): void {
    this.isOpen.set(false);
  }

  button = input.required<ButtonNav>();
}
