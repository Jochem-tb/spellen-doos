import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome/welcome.component';
import { RouterModule } from '@angular/router';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './ui/header/header.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [WelcomeComponent, DashBoardComponent, HeaderComponent],
  exports: [WelcomeComponent, DashBoardComponent, HeaderComponent],
})
export class UiModule {}
