import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome/welcome.component';
import { RouterModule } from '@angular/router';
import { DashBoardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [WelcomeComponent, DashBoardComponent],
  exports: [WelcomeComponent, DashBoardComponent],
})
export class UiModule {}
