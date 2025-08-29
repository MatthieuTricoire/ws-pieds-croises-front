import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ToastComponent } from './shared/components/design-system/toast/toast.component';
import { BoxService } from './chore/services/box.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, LucideAngularModule, ToastComponent],
})
export class AppComponent implements OnInit {
  constructor(private boxService: BoxService) {}

  ngOnInit() {
    this.boxService.fetchBoxInfo();
  }
}
