import { Component } from '@angular/core';
import { HeaderHomePageComponent } from '../../shared/components/header-home-page/header-home-page.component';

@Component({
  selector: 'app-home-page',
  imports: [HeaderHomePageComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {}
