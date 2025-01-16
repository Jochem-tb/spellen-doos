import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { UiModule } from '@spellen-doos/ui';
import { FeatureModule } from '@spellen-doos/features';
import { HelpButtonComponent } from '@spellen-doos/ui';
import { HttpClientModule } from '@angular/common/http';
import { WaitScreenComponent, GamesModule } from '@spellen-doos/frontend/games';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    UiModule,
    HttpClientModule,
    FeatureModule,
    HelpButtonComponent,
    GamesModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
