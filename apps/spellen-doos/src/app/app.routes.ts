import { Route } from '@angular/router';
import { WelcomeComponent } from '@spellen-doos/ui';
import { LoginComponent, RegisterComponent } from '@spellen-doos/features';
import {
  WelcomeComponent,
  DashBoardComponent,
  ProfileComponent,
} from '@spellen-doos/ui';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'dashboard', component: DashBoardComponent },
  { path: 'profile', component: ProfileComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'welcome' }
];
