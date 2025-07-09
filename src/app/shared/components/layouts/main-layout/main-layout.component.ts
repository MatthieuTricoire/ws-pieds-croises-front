import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  template: `
    <!--    Navbar à ajouter ici-->
    <div class="flex flex-col min-h-screen">
      <div class="text-center bg-primary">navbar</div>
      <main class="container px-4 sm:px-0 mx-auto flex-1 py-6 h-100">
        <router-outlet></router-outlet>
      </main>
      <div class="text-center bg-primary">footer</div>
      <!--Footer à ajouter ici-->
    </div>
  `,
  imports: [RouterOutlet],
})
export class MainLayoutComponent {}
