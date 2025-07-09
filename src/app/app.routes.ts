import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { TestComponent } from './pages/test/test.component';
import { authGuard } from './chore/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'test', component: TestComponent, canActivate: [authGuard] },
];
