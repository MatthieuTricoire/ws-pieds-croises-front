import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BoxInfo } from '../../models/boxInfo';
import { BoxService } from '../../../chore/services/box.service';
import { AsyncPipe } from '@angular/common';
import { LucideAngularModule, X, Instagram, Youtube, Linkedin } from 'lucide-angular';
import { ButtonNav } from '../../models/buttonNav';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [AsyncPipe, LucideAngularModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  #boxService = inject(BoxService);
  boxInfo$: Observable<BoxInfo | null> = this.#boxService.boxInfo$;

  readonly socialButtons: ButtonNav[] = [
    { label: 'Lien vers le compte X', path: 'https://twitter.com', icon: X },
    { label: 'Lien vers le compte Instagram', path: 'https://instagram.com', icon: Instagram },
    { label: 'Lien vers le compte YouTube', path: 'https://youtube.com', icon: Youtube },
    { label: 'Lien vers le compte Linkedin', path: 'https://linkedin.com', icon: Linkedin },
  ];
}
