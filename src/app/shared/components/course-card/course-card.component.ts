import { Component, computed, inject, input, output, Signal, signal } from '@angular/core';
import { Course } from '../../models/course';
import {
  AlertTriangle,
  CircleAlert,
  Clock,
  LucideAngularModule,
  MinusCircle,
  PlusCircle,
  UserCircle,
  Users,
} from 'lucide-angular';
import { AuthService } from '../../../chore/services/auth.service';
import { CoursesService } from '../../../chore/services/courses.service';
import { UserSubscriptionService } from '../../../chore/services/user-subscription.service';
import { ToastService } from '../../../chore/services/toast.service';
import { catchError, finalize, of } from 'rxjs';
import { NgClass } from '@angular/common';

type CourseIcon =
  | typeof PlusCircle
  | typeof MinusCircle
  | typeof Clock
  | typeof UserCircle
  | typeof AlertTriangle;

interface ButtonConfig {
  readonly text: string;
  readonly variant:
    | 'btn-disabled'
    | 'btn-disabled loading'
    | 'btn-error'
    | 'btn-warning'
    | 'btn-primary';
  readonly icon: CourseIcon;
  readonly disabled: boolean;
}

@Component({
  selector: 'app-course-card',
  imports: [LucideAngularModule, NgClass],
  templateUrl: './course-card.component.html',
})
export class CourseCardComponent {
  protected readonly Users = Users;
  private readonly MIN_DELAY_TO_BOOK_COURSE = 15;
  private readonly MESSAGES = {
    COURSE_CANCELLED: 'Cours annulé',
    LOADING: 'Chargement...',
    UNREGISTER: 'Se désinscrire',
    WAITING_LIST: "Liste d'attente",
    REGISTER: "S'inscrire",
    PAST_COURSE: 'Cours terminé',
    TO_LATE_TO_BOOK: 'Trop tard pour vous inscrire',
  } as const;

  course = input.required<Course>();
  isLoading = signal(false);
  courseUpdated = output<Course>();

  private authService = inject(AuthService);
  private coursesService = inject(CoursesService);
  private userSubscriptionService = inject(UserSubscriptionService);
  private toastService = inject(ToastService);

  currentUser = this.authService.userSignal;

  startDate = computed(() => new Date(this.course().startDatetime));
  endDate = computed(() => new Date(this.startDate().getTime() + this.course().duration * 60000));
  occupiedSlots = computed(() => this.course().usersId.length);
  totalSlots = computed(() => this.course().personLimit);
  isCourseFull = computed(() => this.occupiedSlots() >= this.totalSlots());
  isCourseAvailable = computed(
    () => this.course().status === 'OPEN' || this.course().status === 'FULL',
  );
  isPastCourse = computed(() => {
    const now = new Date();
    const courseDate = new Date(this.course().startDatetime);
    return courseDate < now;
  });
  isCourseToSoon = computed(() => {
    const now = new Date();
    const timeDifference = this.startDate().getTime() - now.getTime();
    const minutesUntilCourse = Math.floor(timeDifference / 60000);
    return minutesUntilCourse <= this.MIN_DELAY_TO_BOOK_COURSE;
  });
  isUserRegistered = computed(() => {
    const user = this.currentUser();
    if (!user) return false;
    return this.course().usersId.includes(user.id);
  });
  buttonConfig: Signal<ButtonConfig> = computed(() => {
    const loading = this.isLoading();

    if (this.isPastCourse()) {
      return {
        text: this.MESSAGES.PAST_COURSE,
        variant: 'btn-disabled',
        icon: Clock,
        disabled: true,
      };
    }
    if (this.isCourseToSoon()) {
      return {
        text: this.MESSAGES.TO_LATE_TO_BOOK,
        variant: 'btn-warning',
        icon: Clock,
        disabled: true,
      };
    }
    if (!this.isCourseAvailable()) {
      return {
        text: this.MESSAGES.COURSE_CANCELLED,
        variant: 'btn-disabled',
        icon: UserCircle,
        disabled: true,
      };
    }

    if (loading) {
      return {
        text: this.MESSAGES.LOADING,
        variant: 'btn-disabled loading',
        icon: Clock,
        disabled: true,
      };
    }

    if (this.isUserRegistered()) {
      return {
        text: this.MESSAGES.UNREGISTER,
        variant: 'btn-error',
        icon: MinusCircle,
        disabled: false,
      };
    }

    if (this.isCourseFull()) {
      return {
        text: 'Complet',
        variant: 'btn-disabled',
        icon: CircleAlert,
        disabled: false,
      };
    }

    return {
      text: this.MESSAGES.REGISTER,
      variant: 'btn-primary',
      icon: PlusCircle,
      disabled: false,
    };
  });

  private formatTime = computed(() => {
    const start = this.startDate();
    const end = this.endDate();
    return {
      start: `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`,
      end: `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`,
    };
  });

  getStartTime(): string {
    return this.formatTime().start;
  }

  getEndTime(): string {
    return this.formatTime().end;
  }

  handleCourseAction(): void {
    const user = this.currentUser();
    if (!user) {
      this.toastService.show('error', 'Vous devez être connecté pour vous inscrire');
      return;
    }

    if (this.isLoading()) {
      return;
    }

    const courseId = this.course().id;

    if (this.isUserRegistered()) {
      this.unregisterFromCourse(courseId);
    } else if (this.isCourseFull()) {
      this.joinWaitingList(courseId);
    } else {
      this.registerToCourse(courseId);
    }
  }

  private registerToCourse(courseId: number): void {
    const user = this.currentUser();
    if (!user) return;

    this.isLoading.set(true);
    const courseDate = new Date(this.course().startDatetime);

    this.userSubscriptionService.canRegisterToCourse(user.id, courseDate).subscribe({
      next: (validation) => {
        if (!validation.canRegister) {
          this.toastService.show(
            'error',
            validation.reason || 'Inscription impossible',
            undefined,
            AlertTriangle,
          );
          this.isLoading.set(false);
          return;
        }

        this.coursesService
          .registerToCourse(courseId)
          .pipe(
            catchError((error) => {
              console.error('Erreur inscription:', error);
              const message = error.error?.message || "Erreur lors de l'inscription";
              this.toastService.show('error', message);
              return of(null);
            }),
            finalize(() => this.isLoading.set(false)),
          )
          .subscribe({
            next: (result) => {
              if (result !== null) {
                this.refreshCourse();
              }
            },
          });
      },
      error: (error) => {
        console.error('Erreur validation abonnement:', error);
        this.toastService.show('error', 'Erreur lors de la vérification de votre abonnement');
        this.isLoading.set(false);
      },
    });
  }

  private unregisterFromCourse(courseId: number): void {
    this.isLoading.set(true);

    this.coursesService
      .unregisterFromCourse(courseId)
      .pipe(
        catchError((error) => {
          console.error('Erreur désinscription:', error);
          return of(null);
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (result) => {
          if (result !== null) {
            this.refreshCourse();
          }
        },
      });
  }

  private joinWaitingList(courseId: number): void {
    const user = this.currentUser();
    if (!user) return;

    this.isLoading.set(true);
    const courseDate = new Date(this.course().startDatetime);

    this.userSubscriptionService.canRegisterToCourse(user.id, courseDate).subscribe({
      next: (validation) => {
        if (!validation.canRegister) {
          this.toastService.show(
            'warning',
            validation.reason || "Inscription à la liste d'attente impossible",
            undefined,
            AlertTriangle,
          );
          this.isLoading.set(false);
          return;
        }

        this.coursesService
          .joinWaitingList(courseId)
          .pipe(
            catchError((error) => {
              console.error("Erreur liste d'attente:", error);
              const message = error.error?.message || "Erreur lors de l'ajout à la liste d'attente";
              this.toastService.show('error', message);
              return of(null);
            }),
            finalize(() => this.isLoading.set(false)),
          )
          .subscribe({
            next: (result) => {
              if (result !== null) {
                this.toastService.show('success', "Ajouté à la liste d'attente !");
                this.refreshCourse();
              }
            },
          });
      },
      error: (error) => {
        console.error('Erreur validation abonnement:', error);
        this.toastService.show('error', 'Erreur lors de la vérification de votre abonnement');
        this.isLoading.set(false);
      },
    });
  }

  private refreshCourse(): void {
    this.coursesService.getCourseById(this.course().id).subscribe({
      next: (updatedCourse) => {
        this.courseUpdated.emit(updatedCourse);
      },
      error: (error) => {
        console.error('Erreur refresh cours:', error);
      },
    });
  }
}
