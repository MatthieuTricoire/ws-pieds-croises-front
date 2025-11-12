import { Component } from '@angular/core';
import { HeaderStatsPageComponent } from '../../shared/components/header-stats-page/header-stats-page.component';
import { WeightEvolutionComponent } from '../../shared/components/statistics/weight-evolution/weight-evolution.component';
import { CoursesCountComponent } from '../../shared/components/statistics/courses-count/courses-count.component';
import { PerformanceEvolutionComponent } from '../../shared/components/statistics/performance-evolution/performance-evolution.component';

@Component({
  selector: 'app-statistics-page',
  imports: [
    HeaderStatsPageComponent,
    WeightEvolutionComponent,
    CoursesCountComponent,
    PerformanceEvolutionComponent,
  ],
  templateUrl: './statistics-page.component.html',
})
export class StatisticsPageComponent {}
