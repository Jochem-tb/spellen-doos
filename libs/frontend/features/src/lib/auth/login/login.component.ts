import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'lib-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  private subs: Subscription[] = [];
  submitted: boolean | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  async login() {
    if (this.loginForm.valid) {
      this.submitted = true;
      const { userName, password } = this.loginForm.value;
      const hashedPassword = await bcrypt.hash(password, 10);

      this.subs.push(
        (await this.authService.login(userName, hashedPassword)).subscribe(
          (user) => {
            if (user) {
              this.router.navigate(['/dashboard']);
            } else {
              this.errorMessage = 'Invalid username or password';
            }
          },
          (error) => {
            this.errorMessage = error.message;
          }
        )
      );
    } else {
      this.errorMessage = 'Please enter a valid username and password';
    }
  }
}