import { Component, forwardRef, input, Optional, Provider, Self } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { getFirstErrorMessage } from '../../../validators/validation-errors';
import { LucideAngularModule, LucideEye, LucideEyeOff } from 'lucide-angular';

export const CUSTOM_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputComponent),
  multi: true,
};

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  viewProviders: [CUSTOM_CONTROL_VALUE_ACCESSOR],
})
export class InputComponent implements ControlValueAccessor {
  label = input<string>();
  name = input.required<string>();
  type = input<'password' | 'text' | 'email'>('text');
  placeholder = input<string | null>(null);
  showPassword = false;
  value = '';
  isDisabled = false;
  protected readonly LucideEye = LucideEye;
  protected readonly LucideEyeOff = LucideEyeOff;

  constructor(@Self() @Optional() public controlDir: NgControl) {
    if (this.controlDir) {
      this.controlDir.valueAccessor = this;
    }
  }

  get errorMessage(): string | null {
    const control = this.controlDir?.control;
    if (!control || !control.touched || !control.invalid) {
      return null;
    }

    return getFirstErrorMessage(control);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: (value: string) => void = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};

  onInputChange(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.value = newValue;
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
    this.value = value;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  validate(): ValidationErrors | null {
    return null;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
