import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule
  ],
  declarations: [
    RegisterComponent, 
    LoginComponent
  ],

})

export class FeatureModule {}