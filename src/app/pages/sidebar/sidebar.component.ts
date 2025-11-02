import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ButtonNavComponent } from '../../shared/components/button-nav/button-nav.component';
import { ButtonNav } from '../../shared/models/buttonNav';
import {
  Calendar,
  ChartNoAxesColumn,
  Cog,
  Compass,
  DollarSign,
  House,
  LayoutDashboard,
  LogOut,
  LucideAngularModule,
  MessageCircle,
  User,
  Users,
} from 'lucide-angular';
import { AuthService } from '../../chore/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [ButtonNavComponent, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly #authService = inject(AuthService);

  readonly isAdmin = this.#authService.isAdminSignal();

  readonly buttonsAdmin: ButtonNav[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Planification', path: '/admin/planning', icon: Compass },
    { label: 'Communication', path: 'admin/communication', icon: MessageCircle },
    { label: 'Utilisateurs', path: 'admin/utilisateurs', icon: Users },
    { label: 'Abonnements', path: 'admin/abonnements', icon: DollarSign },
  ];

  readonly buttonsGestion: ButtonNav[] = [
    { label: 'Mon Compte', path: '/profile', icon: User },
    { label: 'Se déconnecter', icon: LogOut, action: () => this.logout() },
  ];

  readonly buttonsUser = computed<ButtonNav[]>(() => [
    { label: 'Accueil', path: '/', icon: House },
    { label: 'Planning', path: '/planning', icon: Calendar },
    { label: 'Stats', path: '/stats', icon: ChartNoAxesColumn },
    {
      label: 'Gestion',
      path: '/gestion',
      icon: Cog,
      menuList: this.isAdmin ? this.buttonsAdmin : this.buttonsGestion,
    },
  ]);

  logout(): void {
    console.log('Logout');
    this.#authService.logout().subscribe();
  }

  protected readonly Cog = Cog;
}
