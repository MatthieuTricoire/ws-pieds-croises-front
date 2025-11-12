import { ChartConfiguration } from 'chart.js';

export interface ExerciseChartData {
  exerciseName: string;
  measureType: string;
  chartData: ChartConfiguration<'line'>['data'];
}
