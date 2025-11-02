import { Component, inject, OnInit } from '@angular/core';
import { StatCardComponent } from '../../shared/components/stats-card/stat-card.component';
import { DashboardService } from '../../chore/services/dashboard.service';
import { TypographyComponent } from '../../shared/components/design-system/typography/typography.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [StatCardComponent, TypographyComponent],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit {
  #dashboardService = inject(DashboardService);
  stats = this.#dashboardService.stats;

  ngOnInit() {
    this.#dashboardService.getStats().subscribe();
  }
}
