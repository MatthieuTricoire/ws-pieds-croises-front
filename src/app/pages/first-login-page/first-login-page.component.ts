import { Component, inject, OnInit } from '@angular/core';
import { TwoColumnsLayoutComponent } from '../../shared/components/layouts/two-columns-layout/two-columns-layout.component';
import { FirstLoginFormComponent } from '../../shared/components/forms/first-login-form/first-login-form.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-first-login',
  imports: [TwoColumnsLayoutComponent, FirstLoginFormComponent],
  templateUrl: './first-login-page.component.html',
  styleUrl: './first-login-page.component.css',
})
export class FirstLoginComponent implements OnInit {
  username?: string;
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.username = params['username'];
    });
  }
}
