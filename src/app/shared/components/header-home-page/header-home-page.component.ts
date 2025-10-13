import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TypographyComponent } from '../design-system/typography/typography.component';

@Component({
  selector: 'app-header-home-page',
  imports: [RouterLink, TypographyComponent],
  templateUrl: './header-home-page.component.html',
})
export class HeaderHomePageComponent {}
