import { computed, Injectable, signal } from '@angular/core';

export interface DayInfo {
  index: number;
  shortName: string;
  fullName: string;
  date: Date;
  isDisabled: boolean;
  isSelected: boolean;
}

export type WeekType = 'current' | 'next';

@Injectable({
  providedIn: 'root',
})
export class WeekSelectorService {
  private readonly dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  private readonly dayFullNames = [
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
    'Dimanche',
  ];

  // Signals
  readonly selectedWeekType = signal<WeekType>('current');
  readonly selectedDayIndex = signal<number | null>(null);

  // Computed signals
  readonly currentWeekDates = computed(() => this.getWeekDates(this.selectedWeekType()));

  readonly days = computed(() => {
    const weekDates = this.currentWeekDates();
    const today = this.getTodayWithoutTime();
    const selectedIndex = this.selectedDayIndex();

    return weekDates.map((date, index) => ({
      index,
      shortName: this.dayNames[index],
      fullName: this.dayFullNames[index],
      date,
      isDisabled: date < today,
      isSelected: index === selectedIndex,
    }));
  });

  readonly selectedDay = computed(() => {
    const selectedIndex = this.selectedDayIndex();
    if (selectedIndex === null) {
      return null;
    }
    return this.days().find((day) => day.index === selectedIndex) ?? null;
  });

  readonly weekDateRange = computed(() => {
    const dates = this.currentWeekDates();
    return {
      start: dates[0],
      end: dates[6],
      formatted: `Du ${dates[0].toLocaleDateString('fr-FR')} au ${dates[6].toLocaleDateString('fr-FR')}`,
    };
  });

  readonly selectedDayFormatted = computed(() => {
    const day = this.selectedDay();
    if (!day) {
      return 'Aucun jour sélectionné';
    }
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(day.date);
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  });

  // Methods
  selectWeekType(weekType: WeekType): void {
    if (weekType !== this.selectedWeekType()) {
      this.selectedWeekType.set(weekType);
      this.clearSelectedDay();
    }
  }

  toggleDay(dayIndex: number): void {
    const day = this.days().find((d) => d.index === dayIndex);
    if (!day || day.isDisabled) {
      return;
    }

    this.selectedDayIndex.update((currentIndex) => (currentIndex === dayIndex ? null : dayIndex));
  }

  clearSelectedDay(): void {
    this.selectedDayIndex.set(null);
  }

  private getWeekDates(weekType: WeekType): Date[] {
    const today = new Date();
    const currentDay = today.getDay();

    // Ajuster pour que Lundi soit 0
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

    const mondayOfCurrentWeek = new Date(today);
    mondayOfCurrentWeek.setDate(today.getDate() + mondayOffset);

    if (weekType === 'next') {
      mondayOfCurrentWeek.setDate(mondayOfCurrentWeek.getDate() + 7);
    }

    const weekDates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(mondayOfCurrentWeek);
      date.setDate(mondayOfCurrentWeek.getDate() + i);
      weekDates.push(date);
    }

    return weekDates;
  }

  private getTodayWithoutTime(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }
}
