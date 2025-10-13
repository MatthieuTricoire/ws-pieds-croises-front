import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';

@Component({
  selector: 'app-typography',
  standalone: true,
  templateUrl: './typography.component.html',
  imports: [CommonModule],
})
export class TypographyComponent {
  text = input.required<string>();
  tagType = input<Tag>('p');
  className = input<string>('');

  finalClass = computed(() => {
    switch (this.tagType()) {
      case 'h1':
        return 'text-6xl max-sm:text-4xl font-bold ' + this.className();
      case 'h2':
        return 'text-4xl max-sm:text-3xl font-semibold ' + this.className();
      case 'h3':
        return 'text-3xl max-sm:text-2xl font-semibold ' + this.className();
      case 'h4':
        return 'text-2xl max-sm:text-xl font-semibold ' + this.className();
      case 'p':
        return 'text-base ' + this.className();
      case 'span':
        return 'text-base font-semibold ' + this.className();
      default:
        return 'text-base ' + this.className();
    }
  });
}
