import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserExistsGuard } from '@spellen-doos/backend-user';
import { CreateUserDto } from '@spellen-doos/backend/dto';
import { ProfilePictureEnum, REGISTER_STEPS, UserRole } from '@spellen-doos/shared/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  steps = REGISTER_STEPS;
  currentStepIndex = 0;
  subs: Subscription[] = [];
  registerForm: FormGroup;
  dateToday: string | undefined;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group(
      {
        userName: ['', Validators.required],
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
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      const { userName, dateOfBirth, password } = this.registerForm.value;

      const userDto: CreateUserDto = {
        userName,
        dateOfBirth,
        password,
        profilePicture: ProfilePictureEnum.Pic1,
        role: UserRole.User,
      };

      this.subs.push(
        this.authService.register(userDto).subscribe({
          next: () => {
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error(err);
          },
        })
      )

    }
  }
}
