import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../../../pages/sidebar/sidebar.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-main-layout',
  template: `
    <div class="flex min-h-screen">
      <app-sidebar class="bg-base-200" />
      <div class="flex flex-col w-full min-h-screen max-md:pb-[90px]">
        <main class="container px-4 sm:px-0 mx-auto flex-1 py-6 h-100">
          <router-outlet></router-outlet>
        </main>
        <div class="text-center bg-primary">footer</div>
        <!--Footer à ajouter ici-->
      </div>
    </div>
  `,
  imports: [RouterOutlet, SidebarComponent, LucideAngularModule],
})
export class MainLayoutComponent {}
