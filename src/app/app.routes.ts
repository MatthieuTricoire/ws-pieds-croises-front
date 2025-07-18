import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { authGuard } from './chore/guards/auth.guard';
import { FullLayoutComponent } from './shared/components/layouts/full-layout/full-layout.component';
import { MainLayoutComponent } from './shared/components/layouts/main-layout/main-layout.component';
import { TestComponent } from './pages/test/test.component';
import { FirstLoginComponent } from './pages/first-login-page/first-login-page.component';
import { AskResetPasswordPageComponent } from './pages/ask-reset-password-page/ask-reset-password-page.component';
import { NewPasswordPageComponent } from './pages/new-password-page/new-password-page.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // TODO ajouter les future components
      { path: '', component: TestComponent, canActivate: [authGuard] },
      { path: 'dashboard', component: TestComponent, canActivate: [authGuard] },
      { path: 'planification', component: TestComponent, canActivate: [authGuard] },
      { path: 'communication', component: TestComponent, canActivate: [authGuard] },
      { path: 'utilisateurs', component: TestComponent, canActivate: [authGuard] },
      { path: 'abonnements', component: TestComponent, canActivate: [authGuard] },
      { path: 'stats', component: TestComponent, canActivate: [authGuard] },
      { path: 'planning', component: TestComponent, canActivate: [authGuard] },
      { path: 'gestion', component: TestComponent, canActivate: [authGuard] },
      { path: 'profile', component: TestComponent, canActivate: [authGuard] },
      { path: 'test', component: TestComponent, canActivate: [authGuard] },
    ],
  },
  {
    path: '',
    component: FullLayoutComponent,
    children: [
      { path: 'login', component: LoginPageComponent },
      { path: 'first-login', component: FirstLoginComponent },
      { path: 'ask-reset-password', component: AskResetPasswordPageComponent },
      { path: 'reset-password', component: NewPasswordPageComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
