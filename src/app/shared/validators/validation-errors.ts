import { AbstractControl } from '@angular/forms';

export type AppValidationErrorKey =
  | 'required'
  | 'minlength'
  | 'maxlength'
  | 'invalidEmail'
  | 'noUppercase'
  | 'noNumber'
  | 'noSpecialChar'
  | 'passwordsMismatch';

export type AppValidationErrors = Partial<Record<AppValidationErrorKey, true>>;

export const ValidationErrorMessages: Record<AppValidationErrorKey, string> = {
  required: 'Ce champ est obligatoire',
  minlength: 'Ce champ est trop court',
  maxlength: 'Ce champ est trop long',
  invalidEmail: 'Veuillez entrer une adresse email valide',
  noUppercase: 'Le mot de passe doit contenir au moins une majuscule',
  noNumber: 'Le mot de passe doit contenir au moins un chiffre',
  noSpecialChar: 'Le mot de passe doit contenir au moins un caractère spécial',
  passwordsMismatch: 'Les mots de passe ne correspondent pas',
};

export function getFirstErrorMessage(control: AbstractControl): string | null {
  if (!control || !control.errors || !control.touched) return null;

  const errors = control.errors;
  const firstKey = Object.keys(errors)[0] as AppValidationErrorKey;

  // Cas spécial Angular minlength / maxlength
  if (firstKey === 'minlength') {
    return `La longueur minimale est de ${errors['minlength'].requiredLength} caractères`;
  }
  if (firstKey === 'maxlength') {
    return `La longueur maximale est de ${errors['maxlength'].requiredLength} caractères`;
  }

  return ValidationErrorMessages[firstKey] ?? 'Erreur de validation';
}
