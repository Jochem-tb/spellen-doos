import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { UiModule } from '@spellen-doos/ui';
import { FeatureModule } from '@spellen-doos/features';
import { HelpButtonComponent } from '@spellen-doos/ui';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
    declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes),
        UiModule,
        FeatureModule
      ],
      providers: [],
      bootstrap: [AppComponent]


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    UiModule,
    HttpClientModule,
    HelpButtonComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
