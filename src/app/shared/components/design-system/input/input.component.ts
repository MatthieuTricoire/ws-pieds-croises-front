import { Component, forwardRef, input, Optional, Provider, Self, signal } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';

export const CUSTOM_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputComponent),
  multi: true,
};

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  viewProviders: [CUSTOM_CONTROL_VALUE_ACCESSOR],
})
export class InputComponent implements ControlValueAccessor {
  label = input<string>();
  name = input.required<string>();
  type = input<'password' | 'text' | 'email'>('text');
  // error = input<string | null>(null);
  placeholder = input<string | null>(null);
  value = signal<string>('');
  isDisabled = signal<boolean>(false);

  constructor(@Self() @Optional() public controlDir: NgControl) {}

  get control() {
    return this.controlDir;
  }

  get errorMessage(): string | null {
    if (!(this.control.touched && this.control?.invalid)) {
      return null;
    }
    const errors = this.control.errors;
    if (!errors) {
      return null;
    }

    const firstErrorKey = Object.keys(errors)[0];

    switch (firstErrorKey) {
      case 'required':
        return `${this.label()} is required`;
      case 'email':
        return 'Please enter a valid email address';
      case 'minlength':
        return `Minimum length is ${errors['minlength'].requiredLength}`;
      case 'maxlength':
        return `Maximum length is ${errors['maxlength'].requiredLength}`;
      default:
        return 'Invalid input';
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: (value: string) => void = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};

  onInputChange(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.value.set(newValue);
    this.onChange(newValue);
    this.onTouched();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(value: string): void {
    this.value.set(value);
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  validate(): ValidationErrors | null {
    return null;
  }
}
