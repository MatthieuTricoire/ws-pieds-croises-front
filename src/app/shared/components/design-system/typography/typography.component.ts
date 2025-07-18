import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'section';
@Component({
  selector: 'app-typography',
  standalone: true,
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css'],
  imports: [CommonModule],
})
export class TypographyComponent {
  text = input.required<string>();
  tagType = input<Tag>('p');

  class = computed(() => {
    switch (this.tagType()) {
      case 'h1':
        return 'text-6xl max-sm:text-4xl font-bold';
      case 'h2':
        return 'text-4xl max-sm:text-3xl font-semibold';
      case 'h3':
        return 'text-3xl max-sm:text-2xl font-semibold';
      case 'h4':
        return 'text-2xl max-sm:text-xl font-semibold';
      case 'p':
        return 'text-base';
      case 'span':
        return 'text-base font-semibold';
      case 'section':
        return 'text-base font-semibold';
      default:
        return 'text-base';
    }
  });
}
