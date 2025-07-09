import { AbstractControl, ValidationErrors } from '@angular/forms';
import { AppValidationErrors } from './validation-errors';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value;
  if (!value) return null;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  const errors: AppValidationErrors = {};

  if (!hasUpperCase) {
    errors['noUppercase'] = true;
  }
  if (!hasNumber) {
    errors['noNumber'] = true;
  }
  if (!hasSpecialChar) {
    errors['noSpecialChar'] = true;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

export function strictEmailValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value;
  if (!value) return null;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = emailRegex.test(value);

  const errors: AppValidationErrors = {};

  if (!isValid) {
    errors['invalidEmail'] = true;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
