import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CreateUserDto } from '@spellen-doos/backend/dto';
import { REGISTER_STEPS } from '@spellen-doos/shared/api';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  steps = REGISTER_STEPS;
  currentStepIndex = 0;
  registerForm: FormGroup;
  dateToday: string | undefined;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group(
      {
        userName: ['', [Validators.required], [this.asyncUsernameValidator()]],
        dateOfBirth: ['', [Validators.required, this.minAgeValidator(13)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator() }
    );
  }

  ngOnInit() {
    const currentDate = new Date();
    this.dateToday = currentDate.toISOString().split('T')[0];
    this.registerForm.patchValue({ dateOfBirth: this.dateToday });
  }

  minAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl) => {
      const dateOfBirth = new Date(control.value);
      const currentDate = new Date();
      const age = currentDate.getFullYear() - dateOfBirth.getFullYear();
      if (age < minAge) {
        return { minAge: true };
      }
      return null;
    };
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const formGroup = control as FormGroup;
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;

      if (password !== confirmPassword) {
        formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
      } else {
        formGroup.get('confirmPassword')?.setErrors(null);
      }
      return null;
    };
  }

  get currentStep() {
    return this.steps[this.currentStepIndex];
  }

  nextStep() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
    }
  }

  previousStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const registerDto: CreateUserDto = this.registerForm.value;
    this.authService.register(registerDto).subscribe(
      (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration failed', error);
      }
    );
  }

  asyncUsernameValidator(): (control: AbstractControl) => Observable<{ [key: string]: any } | null> {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      console.log('Checking username existence for:', control.value);
      return this.authService.checkUserNameExistence(control.value).pipe(
        map((exists: boolean) => {
          console.log('Username existence check response:', exists);
          return exists ? { usernameTaken: true } : null;
        }),
        catchError((error) => {
          console.error('Error checking username existence:', error);
          return of(null);
        })
      );
    };
  }
}
