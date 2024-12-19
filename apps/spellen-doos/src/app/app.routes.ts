import { Route } from '@angular/router';
import { WelcomeComponent } from '@spellen-doos/ui';
import { LoginComponent, RegisterComponent } from '@spellen-doos/features';

export const appRoutes: Route[] = [

    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },

    { path: '**', redirectTo: 'welcome' }
];
