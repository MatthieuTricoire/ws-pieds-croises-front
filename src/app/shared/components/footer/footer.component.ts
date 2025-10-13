import { Component, inject } from '@angular/core';
import { BoxService } from '../../../chore/services/box.service';
import { LucideAngularModule, X, Instagram, Youtube, Linkedin } from 'lucide-angular';
import { ButtonNav } from '../../models/buttonNav';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  #boxService = inject(BoxService);
  boxInfo = this.#boxService.boxSignal;

  readonly socialButtons: ButtonNav[] = [
    { label: 'Lien vers le compte X', path: 'https://twitter.com', icon: X },
    { label: 'Lien vers le compte Instagram', path: 'https://instagram.com', icon: Instagram },
    { label: 'Lien vers le compte YouTube', path: 'https://youtube.com', icon: Youtube },
    { label: 'Lien vers le compte Linkedin', path: 'https://linkedin.com', icon: Linkedin },
  ];
}
