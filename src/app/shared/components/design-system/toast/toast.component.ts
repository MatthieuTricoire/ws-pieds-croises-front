import { Component, inject } from '@angular/core';
import { ToastService } from '../../../../chore/services/toast.service';
import { CircleCheckBig, LucideAngularModule, X } from 'lucide-angular';

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
}
