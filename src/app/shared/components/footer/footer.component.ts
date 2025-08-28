import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BoxInfo } from '../../models/boxInfo';
import { BoxService } from '../../../chore/services/box.service';
import { AsyncPipe } from '@angular/common';
import { TypographyComponent } from '../design-system/typography/typography.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [AsyncPipe, TypographyComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  boxInfo$: Observable<BoxInfo>;

  constructor(private boxService: BoxService) {
    this.boxInfo$ = this.boxService.getBoxInfo();
  }
}
