import { Route } from '@angular/router';
import { LoginComponent, RegisterComponent } from '@spellen-doos/features';
import {
  WelcomeComponent,
  DashBoardComponent,
  ProfileComponent,
} from '@spellen-doos/ui';
import { AuthGuard } from '@spellen-doos/features';
import {
  BingoComponent,
  RpsComponent,
  WaitScreenComponent,
} from '@spellen-doos/frontend/games';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  {
    path: 'dashboard',
    component: DashBoardComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'waitScreen/:id',
    component: WaitScreenComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'rpsGame/:id',
    component: RpsComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'bingoGame/:id',
    component: BingoComponent,
    // canActivate: [AuthGuard],
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  { path: '**', redirectTo: 'dashboard' },
];
