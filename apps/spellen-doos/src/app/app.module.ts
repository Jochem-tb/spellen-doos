import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { UiModule } from '@spellen-doos/ui';



@NgModule({
    declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes),
        UiModule
      ],
      providers: [],
      bootstrap: [AppComponent]
})
export class AppModule {}