import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../../../pages/sidebar/sidebar.component';
import { LucideAngularModule } from 'lucide-angular';
import { FooterComponent } from '../../footer/footer.component';
import { MobileHeaderComponent } from '../../mobile-header/mobile-header.component';

@Component({
  selector: 'app-main-layout',
  template: `
    <div class="flex min-h-screen overflow-x-hidden">
      <app-sidebar class="bg-base-200 md:border-r border-base-300" />
      <div class="flex flex-col w-full min-h-screen max-md:pb-[90px]">
        <app-mobile-header />
        <main
          class="w-full md:pl-[200px] px-4 max-md:pt-0 sm:px-6 flex-1 py-6 box-border md:max-w-6xl md:mx-auto"
        >
          <router-outlet></router-outlet>
        </main>
        <app-footer />
      </div>
    </div>
  `,
  imports: [
    RouterOutlet,
    SidebarComponent,
    LucideAngularModule,
    FooterComponent,
    MobileHeaderComponent,
  ],
})
export class MainLayoutComponent {}
