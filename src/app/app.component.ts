import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ToastComponent } from './shared/components/design-system/toast/toast.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, LucideAngularModule, ToastComponent],
})
export class AppComponent {}
