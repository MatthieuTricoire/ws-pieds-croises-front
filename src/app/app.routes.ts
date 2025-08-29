import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { adminGuard, authGuard } from './chore/guards/auth.guard';
import { FullLayoutComponent } from './shared/components/layouts/full-layout/full-layout.component';
import { MainLayoutComponent } from './shared/components/layouts/main-layout/main-layout.component';
import { TestComponent } from './pages/test/test.component';
import { FirstLoginComponent } from './pages/first-login-page/first-login-page.component';
import { AskResetPasswordPageComponent } from './pages/ask-reset-password-page/ask-reset-password-page.component';
import { NewPasswordPageComponent } from './pages/new-password-page/new-password-page.component';
import { CourseReservationPageComponent } from './pages/course-reservation-page/course-reservation-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { UsersPageComponent } from './pages/user-page/user-page.component';
import { MessagesPageComponent } from './pages/messages-page/messages-page.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomePageComponent, canActivate: [authGuard] },
      { path: 'dashboard', component: TestComponent, canActivate: [authGuard] },
      { path: 'planification', component: TestComponent, canActivate: [authGuard] },
      { path: 'communication', component: TestComponent, canActivate: [authGuard] },
      { path: 'utilisateurs', component: TestComponent, canActivate: [authGuard] },
      { path: 'abonnements', component: TestComponent, canActivate: [authGuard] },
      { path: 'stats', component: TestComponent, canActivate: [authGuard] },
      { path: 'planning', component: CourseReservationPageComponent, canActivate: [authGuard] },
      { path: 'gestion', component: TestComponent, canActivate: [authGuard] },
      { path: 'profile', component: ProfilePageComponent, canActivate: [authGuard] },
      { path: 'test', component: TestComponent, canActivate: [authGuard] },

      {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
          { path: 'users', component: UsersPageComponent },
          { path: 'messages', component: MessagesPageComponent },
        ],
      },
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
