import { FormControl } from '@angular/forms';
import { passwordValidator, strictEmailValidator } from './validators';

describe('strictEmailValidator', () => {
  it('should return null if control value is empty', () => {
    const control = new FormControl('');
    expect(strictEmailValidator(control)).toBeNull();
  });

  it('should return error for invalid email (no domain dot)', () => {
    const control = new FormControl('matthieu@fdsfds');
    const result = strictEmailValidator(control);
    expect(result).toEqual(jasmine.objectContaining({ invalidEmail: true }));
  });

  it('should return error for invalid email (no @)', () => {
    const control = new FormControl('matthieufdsfds');
    const result = strictEmailValidator(control);
    expect(result).toEqual(jasmine.objectContaining({ invalidEmail: true }));
  });

  it('should return null for valid email', () => {
    const control = new FormControl('matthieu@example.com');
    expect(strictEmailValidator(control)).toBeNull();
  });
});

describe('passwordValidator', () => {
  it('should return null if control value is empty', () => {
    const control = new FormControl('');
    expect(passwordValidator(control)).toBeNull();
  });

  it('should return error for invalid password (no uppercase letter)', () => {
    const control = new FormControl('password123!');
    const result = passwordValidator(control);
    expect(result).toEqual(jasmine.objectContaining({ noUppercase: true }));
  });

  it('should return error for invalid password (no number)', () => {
    const control = new FormControl('Password!');
    const result = passwordValidator(control);
    expect(result).toEqual(jasmine.objectContaining({ noNumber: true }));
  });
});
