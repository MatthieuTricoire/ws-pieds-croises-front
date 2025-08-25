import { Component, inject } from '@angular/core';
import { ToastService } from '../../../../chore/services/toast.service';
import {
  CircleCheck,
  CircleCheckBig,
  InfoIcon,
  LucideAngularModule,
  LucideIconData,
  X,
} from 'lucide-angular';

@Component({
  selector: 'app-toast',
  imports: [LucideAngularModule],
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  toastService = inject(ToastService);
  toasts = this.toastService.toasts;
  protected readonly X = X;
  protected readonly CircleCheckBig = CircleCheckBig;

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  getIconName(alertType: string): LucideIconData {
    switch (alertType) {
      case 'success':
        return CircleCheck;
      case 'error':
        return X;
      case 'info':
        return InfoIcon;
      default:
        return InfoIcon;
    }
  }
}
