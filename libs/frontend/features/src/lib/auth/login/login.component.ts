import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'lib-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { 
    this.loginForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(8)]],
        });
  }
  
  login() {
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe(
      response => {
        console.log('Login successful', response);
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.error('Login failed', error);
        this.errorMessage = error.error.message || 'Login failed. Please try again.';
      }
    );
  }
}