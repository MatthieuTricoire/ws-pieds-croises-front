import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ToastComponent } from './shared/components/design-system/toast/toast.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, LucideAngularModule, ToastComponent, FooterComponent],
})
export class AppComponent {}
