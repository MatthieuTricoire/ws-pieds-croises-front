import { Component, inject, signal, computed } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TypographyComponent } from '../../design-system/typography/typography.component';
import { StatsCardComponent } from '../stats-card/stats-card.component';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { PerformanceHistoryService } from '../../../../chore/services/performance-history.service';
import { PerformanceHistory } from '../../../models/performanceHistory';
import { ExerciseService } from '../../../../chore/services/exercise.service';
import { Exercise } from '../../../models/exercise';
import { ExerciseChartData } from '../../../models/exerciseChartData';

@Component({
  selector: 'app-performance-evolution',
  imports: [BaseChartDirective, TypographyComponent, StatsCardComponent, LucideAngularModule],
  templateUrl: './performance-evolution.component.html',
})
export class PerformanceEvolutionComponent {
  #performanceHistoryService = inject(PerformanceHistoryService);
  #exerciseService = inject(ExerciseService);

  #performanceHistory = signal<PerformanceHistory[]>([]);
  #exercises = signal<Exercise[]>([]);

  public exerciseCharts = computed<ExerciseChartData[]>(() => {
    const performances = this.#performanceHistory();
    const exercises = this.#exercises();

    return exercises
      .map((ex) => {
        const data = performances.filter((p) => p.exerciseId === ex.id);
        if (data.length === 0) return null;

        return {
          exerciseName: ex.name,
          measureType: ex.measureType,
          chartData: {
            labels: data.map((d) => d.date),
            datasets: [
              {
                data: data.map((d) => d.measuredValue),
                label: ex.measureType == 'WEIGHT' ? 'Poids (kg)' : 'Nombre de répétitions',
                fill: true,
                tension: 0.4,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                pointBackgroundColor: '#3b82f6',
              },
            ],
          },
        };
      })
      .filter(Boolean) as ExerciseChartData[];
  });

  public lineChartType = 'line' as const;
  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };
  public plusIcon = Plus;

  constructor() {
    this.loadPerformanceHistory();
    this.loadExercises();
  }

  private loadPerformanceHistory(months?: number) {
    this.#performanceHistoryService.getPerformanceHistory(months).subscribe({
      next: (data) => this.#performanceHistory.set(data),
      error: (err) => console.error('Erreur récupération performances', err),
    });
  }

  private loadExercises() {
    this.#exerciseService.getExercises().subscribe({
      next: (data) => this.#exercises.set(data),
      error: (err) => console.error('Erreur récupération exercices', err),
    });
  }
}
