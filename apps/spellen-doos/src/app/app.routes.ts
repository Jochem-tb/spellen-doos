import { Route } from '@angular/router';
import { WelcomeComponent, DashBoardComponent } from '@spellen-doos/ui';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'dashboard', component: DashBoardComponent },

  { path: '**', redirectTo: 'welcome' },
];
