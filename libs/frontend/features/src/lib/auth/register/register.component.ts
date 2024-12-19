import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { REGISTER_STEPS } from '@spellen-doos/shared/api';

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

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        // user needs to be 65 years old to register so we set the min age to 65 but check from date of birth
        dateOfBirth: ['', [Validators.required, this.minAgeValidator(65)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator() }
    );
  }

  ngOnInit() {
    // Get current date in YYYY-MM-DD format
    const currentDate = new Date();
    this.dateToday = currentDate.toISOString().split('T')[0]; // Format the date to YYYY-MM-DD
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
      // Process registration
      this.router.navigate(['/dashboard']);
    }
  }
}
