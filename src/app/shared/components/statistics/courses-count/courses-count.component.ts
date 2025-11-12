import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TypographyComponent } from '../../design-system/typography/typography.component';
import { StatsCardComponent } from '../stats-card/stats-card.component';

@Component({
  selector: 'app-courses-count',
  imports: [BaseChartDirective, TypographyComponent, StatsCardComponent],
  templateUrl: './courses-count.component.html',
})
export class CoursesCountComponent {
  public barChartType = 'bar' as const;

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    datasets: [
      {
        data: [2, 3, 1, 4, 0, 1, 2],
        label: 'Cours inscrits',
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: '#10b981',
        borderWidth: 1,
      },
    ],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };
}
