import { Route } from '@angular/router';
import { WelcomeComponent } from '@spellen-doos/ui';

export const appRoutes: Route[] = [

    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: 'welcome', component: WelcomeComponent },

    { path: '**', redirectTo: 'welcome' }
];
