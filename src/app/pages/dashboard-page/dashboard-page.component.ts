import { Component, inject, OnInit } from '@angular/core';
import { StatCardComponent } from '../../shared/components/stats-card/stat-card.component';
import { DashboardService } from '../../chore/services/dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [StatCardComponent],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit {
  #dashboardService = inject(DashboardService);
  stats = this.#dashboardService.stats();

  ngOnInit() {
    this.#dashboardService.getStats().subscribe();
  }
}
