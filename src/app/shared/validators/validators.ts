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

export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const passwordControl = control.get('password');
  const confirmPasswordControl = control.get('confirmPassword');

  if (!passwordControl || !confirmPasswordControl) {
    return null;
  }

  const password = passwordControl.value;
  const confirmPassword = confirmPasswordControl.value;

  if (password !== confirmPassword) {
    confirmPasswordControl.setErrors({ passwordsMismatch: true });
    return { passwordsMismatch: true };
  } else {
    if (confirmPasswordControl.errors && confirmPasswordControl.errors['passwordsMismatch']) {
      const newErrors = { ...confirmPasswordControl.errors };
      delete newErrors['passwordsMismatch'];

      if (Object.keys(newErrors).length === 0) {
        confirmPasswordControl.setErrors(null);
      } else {
        confirmPasswordControl.setErrors(newErrors);
      }
    }
    return null;
  }
}
