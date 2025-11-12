import { Component, inject, signal, computed } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TypographyComponent } from '../../design-system/typography/typography.component';
import { StatsCardComponent } from '../stats-card/stats-card.component';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { WeightHistoryService } from '../../../../chore/services/weight-history.service';
import { WeightHistory } from '../../../models/weightHistory';
import { ModalService } from '../../../../chore/services/modal.service';

@Component({
  selector: 'app-weight-evolution',
  standalone: true,
  imports: [BaseChartDirective, TypographyComponent, StatsCardComponent, LucideAngularModule],
  templateUrl: './weight-evolution.component.html',
})
export class WeightEvolutionComponent {
  #statisticsService = inject(WeightHistoryService);
  #modalService = inject(ModalService);
  #weightHistory = signal<WeightHistory[]>([]);

  public plusIcon = Plus;

  public lineChartType = 'line' as const;

  public lineChartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const data = this.#weightHistory();
    return {
      labels: data.map((d) => d.date),
      datasets: [
        {
          data: data.map((d) => d.weight),
          label: 'Poids (kg)',
          fill: true,
          tension: 0.4,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          pointBackgroundColor: '#3b82f6',
        },
      ],
    };
  });

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  constructor() {
    this.loadWeightHistory();
  }

  loadWeightHistory(months?: number) {
    this.#statisticsService.getWeightHistory(months).subscribe({
      next: (data) => this.#weightHistory.set(data),
      error: (err) => {
        console.error('Erreur récupération poids', err);
      },
    });
  }

  onCreateWeightHistory() {
    this.#modalService.show('weight-history-modal');
  }
}
