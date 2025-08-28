import { Component, inject, input, output } from '@angular/core';
import {
  DayInfo,
  WeekSelectorService,
  WeekType,
} from '../../../chore/services/week-selector.service';

@Component({
  selector: 'app-week-selector',
  imports: [],
  templateUrl: './week-selector.component.html',
  styleUrl: './week-selector.component.css',
})
export class WeekSelectorComponent {
  // Inputs avec valeurs par défaut
  readonly title = input<string>('Sélecteur de jours');
  readonly showSelectedDays = input<boolean>(true);
  readonly allowMultipleSelection = input<boolean>(true);

  // Outputs
  readonly daySelected = output<DayInfo>();
  readonly daysChanged = output<DayInfo[]>();
  readonly weekChanged = output<WeekType>();

  // Inject du service
  readonly weekService = inject(WeekSelectorService);

  selectWeek(weekType: WeekType): void {
    this.weekService.selectWeekType(weekType);
    this.weekChanged.emit(weekType);
  }

  toggleDay(dayIndex: number): void {
    if (!this.allowMultipleSelection()) {
      // Si sélection simple, effacer les autres
      this.weekService.clearSelectedDay();
    }

    this.weekService.toggleDay(dayIndex);

    const dayAfter = this.weekService.days().find((d) => d.index === dayIndex);
    if (dayAfter) {
      this.daySelected.emit(dayAfter);
    }
  }

  getDayButtonClasses(day: DayInfo): string {
    if (day.isDisabled) {
      return 'day-btn-disabled';
    }
    if (day.isSelected) {
      return 'text-primary';
    }
    return 'day-btn-available';
  }
}
