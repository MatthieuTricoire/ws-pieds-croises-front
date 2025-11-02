import { TestBed } from '@angular/core/testing';
import { WeekSelectorService } from './week-selector.service';

describe('WeekSelectorService', () => {
  let service: WeekSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeekSelectorService);
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(service.selectedWeekType()).toBe('current');

      // Auto-select today on init
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const found = service.days().find((d) => d.date.toDateString() === today.toDateString());
      expect(service.selectedDayIndex()).toBe(found?.index ?? null);
    });

    it('should have 7 days with correct structure', () => {
      const days = service.days();
      expect(days).toHaveSize(7);

      days.forEach((day, index) => {
        expect(day.index).toBe(index);
        expect(day.shortName).toBeDefined();
        expect(day.fullName).toBeDefined();
        expect(day.date).toBeInstanceOf(Date);
        expect(typeof day.isDisabled).toBe('boolean');
        expect(typeof day.isSelected).toBe('boolean');
      });
    });

    it('should have correct day names', () => {
      const days = service.days();
      expect(days[0].shortName).toBe('L');
      expect(days[0].fullName).toBe('Lundi');
      expect(days[1].shortName).toBe('M');
      expect(days[1].fullName).toBe('Mardi');
      expect(days[6].shortName).toBe('D');
      expect(days[6].fullName).toBe('Dimanche');
    });
  });

  describe('Week Selection', () => {
    it('should switch to next week', () => {
      const currentWeekDates = service.currentWeekDates();

      service.selectWeekType('next');
      expect(service.selectedWeekType()).toBe('next');

      const nextWeekDates = service.currentWeekDates();

      expect(nextWeekDates[0].getTime()).not.toBe(currentWeekDates[0].getTime());

      const daysDiff = Math.round(
        (nextWeekDates[0].getTime() - currentWeekDates[0].getTime()) / (1000 * 60 * 60 * 24),
      );
      expect(daysDiff).toBe(7);
    });

    it('should clear selected day when switching weeks', () => {
      service.clearSelectedDay();

      const days = service.days();
      const availableDay = days.find((d) => !d.isDisabled);

      if (availableDay) {
        service.toggleDay(availableDay.index);
        expect(service.selectedDayIndex()).toBe(availableDay.index);

        service.selectWeekType('next');
        expect(service.selectedDayIndex()).toBeNull();
      }
    });

    it('should not clear selection when selecting same week type', () => {
      const days = service.days();
      const availableDay = days.find((d) => !d.isDisabled);

      if (availableDay) {
        service.toggleDay(availableDay.index);
        const selectedIndex = service.selectedDayIndex();

        service.selectWeekType('current');
        expect(service.selectedDayIndex()).toBe(selectedIndex);
      }
    });
  });

  describe('Day Selection Logic', () => {
    it('should toggle day selection correctly', () => {
      // Ensure a clean start (auto-selected on init)
      service.clearSelectedDay();

      const days = service.days();
      const availableDay = days.find((d) => !d.isDisabled);

      if (availableDay) {
        expect(service.selectedDayIndex()).toBeNull();

        service.toggleDay(availableDay.index);
        expect(service.selectedDayIndex()).toBe(availableDay.index);

        service.toggleDay(availableDay.index);
        expect(service.selectedDayIndex()).toBeNull();
      }
    });

    it('should not select disabled days', () => {
      // Ensure no pre-selection interferes
      service.clearSelectedDay();

      const days = service.days();
      const disabledDay = days.find((d) => d.isDisabled);

      if (disabledDay) {
        service.toggleDay(disabledDay.index);
        expect(service.selectedDayIndex()).toBeNull();
      }
    });

    it('should clear selected day manually', () => {
      // Ensure a predictable start
      service.clearSelectedDay();

      const days = service.days();
      const availableDay = days.find((d) => !d.isDisabled);

      if (availableDay) {
        service.toggleDay(availableDay.index);
        expect(service.selectedDayIndex()).toBe(availableDay.index);

        service.clearSelectedDay();
        expect(service.selectedDayIndex()).toBeNull();
      }
    });
  });

  describe('Computed Values', () => {
    it('should return null for selectedDay when no day is selected', () => {
      // Move to next week where selection is cleared by design
      service.selectWeekType('next');
      expect(service.selectedDay()).toBeNull();
    });

    it('should return correct selectedDay when day is selected', () => {
      // Start from a clean state
      service.clearSelectedDay();

      const days = service.days();
      const availableDay = days.find((d) => !d.isDisabled);

      if (availableDay) {
        service.toggleDay(availableDay.index);

        const selectedDay = service.selectedDay();
        expect(selectedDay).toBeTruthy();
        expect(selectedDay!.index).toBe(availableDay.index);
        expect(selectedDay!.isSelected).toBeTrue();
      }
    });

    it('should show default message when no day is selected', () => {
      // Ensure no selection by switching week
      service.selectWeekType('next');
      const formatted = service.selectedDayFormatted();
      expect(formatted).toBe('Aucun jour sélectionné');
    });

    it('should format selected day correctly when day is selected', () => {
      // Start from a clean state
      service.clearSelectedDay();

      const days = service.days();
      const availableDay = days.find((d) => !d.isDisabled);

      if (availableDay) {
        service.toggleDay(availableDay.index);

        const formatted = service.selectedDayFormatted();
        expect(formatted).toBeDefined();
        expect(formatted).not.toBe('Aucun jour sélectionné');
        expect(formatted.charAt(0)).toBe(formatted.charAt(0).toUpperCase());
      }
    });

    it('should provide week date range with proper format', () => {
      const weekRange = service.weekDateRange();

      expect(weekRange.start).toBeInstanceOf(Date);
      expect(weekRange.end).toBeInstanceOf(Date);
      expect(weekRange.formatted).toContain('Du');
      expect(weekRange.formatted).toContain('au');

      expect(weekRange.end.getTime()).toBeGreaterThan(weekRange.start.getTime());
    });
  });

  describe('Date Logic', () => {
    it('should have consecutive dates through the week', () => {
      const days = service.days();

      for (let i = 1; i < days.length; i++) {
        const prevDay = days[i - 1];
        const currentDay = days[i];
        const dayDiff = currentDay.date.getTime() - prevDay.date.getTime();

        // Be robust to DST transitions: accept 23h..25h in ms
        const HOURS = 60 * 60 * 1000;
        expect(dayDiff).toBeGreaterThanOrEqual(23 * HOURS);
        expect(dayDiff).toBeLessThanOrEqual(25 * HOURS);
      }
    });

    it('should mark past days as disabled in current week', () => {
      service.selectWeekType('current');
      const days = service.days();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      days.forEach((day) => {
        if (day.date < today) {
          expect(day.isDisabled).toBeTrue();
        } else {
          expect(day.isDisabled).toBeFalse();
        }
      });
    });

    it('should not mark any days as disabled in next week', () => {
      service.selectWeekType('next');
      const days = service.days();

      days.forEach((day) => {
        expect(day.isDisabled).toBeFalse();
      });
    });

    it('should have Monday as first day and Sunday as last day', () => {
      const days = service.days();

      expect(days[0].fullName).toBe('Lundi');
      expect(days[6].fullName).toBe('Dimanche');

      const mondayDate = days[0].date;
      const sundayDate = days[6].date;
      const daysDiff = Math.round(
        (sundayDate.getTime() - mondayDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      expect(daysDiff).toBe(6);
    });
  });

  describe('Signal Reactivity', () => {
    it('should update days when week type changes', () => {
      const currentDays = service.days();

      service.selectWeekType('next');
      const nextDays = service.days();

      expect(nextDays[0].date.getTime()).not.toBe(currentDays[0].date.getTime());
    });

    it('should update isSelected property when day is toggled', () => {
      // Ensure no pre-selected day interferes with the assertion
      service.clearSelectedDay();

      const initialDays = service.days();
      const availableDay = initialDays.find((d) => !d.isDisabled);

      if (availableDay) {
        expect(availableDay.isSelected).toBeFalse();

        service.toggleDay(availableDay.index);

        const updatedDays = service.days();
        const updatedDay = updatedDays.find((d) => d.index === availableDay.index);
        expect(updatedDay!.isSelected).toBeTrue();
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid day index gracefully', () => {
      const initialSelectedIndex = service.selectedDayIndex();

      service.toggleDay(-1);
      expect(service.selectedDayIndex()).toBe(initialSelectedIndex);

      service.toggleDay(10);
      expect(service.selectedDayIndex()).toBe(initialSelectedIndex);
    });

    it('should maintain signal consistency', () => {
      const days = service.days();
      const selectedDayComputed = service.selectedDay();
      const selectedIndex = service.selectedDayIndex();

      if (selectedIndex !== null) {
        const dayFromArray = days.find((d) => d.index === selectedIndex);
        expect(dayFromArray).toBeDefined();
        if (dayFromArray && selectedDayComputed) {
          expect(dayFromArray).toEqual(selectedDayComputed);
        }
      } else {
        expect(selectedDayComputed).toBeNull();
      }
    });
  });
});
