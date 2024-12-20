import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WelcomeComponent } from './welcome/welcome.component';
import { RouterModule } from '@angular/router';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './ui/header/header.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule],
  declarations: [
    WelcomeComponent,
    DashBoardComponent,
    HeaderComponent,
    ProfileComponent,
  ],
  exports: [
    WelcomeComponent,
    DashBoardComponent,
    HeaderComponent,
    ProfileComponent,
  ],
})
export class UiModule {}
