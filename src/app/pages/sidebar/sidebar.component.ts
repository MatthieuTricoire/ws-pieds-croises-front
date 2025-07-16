import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { ButtonNavComponent } from '../../shared/components/button-nav/button-nav.component';
import { ButtonNav } from '../../shared/models/buttonNav';
import {
  Calendar,
  House,
  ChartNoAxesColumn,
  LayoutDashboard,
  Compass,
  MessageCircle,
  Users,
  DollarSign,
  User,
  LogOut,
  Cog,
  LucideAngularModule,
} from 'lucide-angular';
import { AuthService } from '../../chore/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [ButtonNavComponent, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);

  readonly isAdmin = signal(this.authService.isAdmin());

  readonly buttonsAdmin: ButtonNav[] = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Planification', path: '/planification', icon: Compass },
    { label: 'Communication', path: '/communication', icon: MessageCircle },
    { label: 'Utilisateurs', path: '/utilisateurs', icon: Users },
    { label: 'Abonnements', path: '/abonnements', icon: DollarSign },
  ];

  readonly buttonsGestion: ButtonNav[] = [
    { label: 'Mon Compte', path: '/profile', icon: User },
    { label: 'Se déconnecter', path: 'null', icon: LogOut, action: () => this.logout() },
  ];

  readonly buttonsUser = computed<ButtonNav[]>(() => [
    { label: 'Accueil', path: '/', icon: House },
    { label: 'Planning', path: '/planning', icon: Calendar },
    { label: 'Stats', path: '/stats', icon: ChartNoAxesColumn },
    {
      label: 'Gestion',
      path: '/gestion',
      icon: Cog,
      menuList: this.isAdmin() ? this.buttonsAdmin : this.buttonsGestion,
    },
  ]);

  logout(): void {
    this.authService.logout();
  }

  protected readonly Cog = Cog;
}
