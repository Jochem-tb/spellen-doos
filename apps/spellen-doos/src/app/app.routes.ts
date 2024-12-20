import { Route } from '@angular/router';
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

  { path: '**', redirectTo: 'welcome' },
];
