import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Course } from '../../models/course';
import { CoursesService } from '../../../chore/services/courses.service';
import { NgClass } from '@angular/common';
import {
  Calendar,
  Clock,
  Edit,
  LucideAngularModule,
  Plus,
  Trash,
  User,
  Users,
} from 'lucide-angular';
import { ModalService } from '../../../chore/services/modal.service';
import { ToastService } from '../../../chore/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-courses-list',
  imports: [NgClass, LucideAngularModule],
  templateUrl: './admin-courses-list.component.html',
})
export class AdminCoursesListComponent implements OnInit, OnDestroy {
  readonly editIcon = Edit;
  readonly trashIcon = Trash;
  readonly calendarIcon = Calendar;
  readonly userIcon = User;
  readonly clockIcon = Clock;
  readonly usersIcon = Users;
  readonly plusIcon = Plus;
  allCourses = signal<Course[]>([]);
  searchTerm = signal<string>('');
  selectedCoach = signal<string>('');
  selectedStatus = signal<string>('');
  isLoading = signal(false);

  #courseService = inject(CoursesService);
  #modalService = inject(ModalService);
  #toastService = inject(ToastService);

  private coursesUpdatedSubscription?: Subscription;

  filteredCourses = computed(() => {
    const now = new Date();
    const courses = this.allCourses()
      .filter((course) => new Date(course.startDatetime) > now)
      .filter((course) => {
        const term = this.searchTerm().toLocaleLowerCase();
        if (!term) {
          return true;
        }
        return (
          course.title.toLocaleLowerCase().includes(term) ||
          course.description.toLocaleLowerCase().includes(term) ||
          course.coachName.toLocaleLowerCase().includes(term)
        );
      })
      .filter((course) => {
        const coach = this.selectedCoach();
        return !coach || course.coachName === coach;
      })
      .filter((course) => {
        const status = this.selectedStatus();
        return !status || course.status === status;
      });

    return courses.sort(
      (a, b) => new Date(a.startDatetime).getTime() - new Date(b.startDatetime).getTime(),
    );
  });

  availableCoaches = computed(() => {
    const coaches = this.allCourses().map((course) => course.coachName);
    return [...new Set(coaches)].sort();
  });

  ngOnInit() {
    this.loadCourses();

    this.coursesUpdatedSubscription = this.#courseService.onCourseUpdated.subscribe(() => {
      this.loadCourses();
    });
  }

  ngOnDestroy() {
    if (this.coursesUpdatedSubscription) {
      this.coursesUpdatedSubscription.unsubscribe();
    }
  }

  loadCourses() {
    this.isLoading.set(true);
    this.#courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.allCourses.set(courses);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.isLoading.set(false);
      },
    });
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  onCoachFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCoach.set(target.value);
  }

  onStatusFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus.set(target.value);
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'badge-success';
      case 'FULL':
        return 'badge-warning';
      case 'CANCELLED':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  }

  async confirmDeleteCourse(course: Course) {
    const confirmed = await this.#modalService.confirmDelete(
      'Supprimer le cours',
      `Êtes-vous sûr de vouloir supprimer le cours "${course.title}" du ${this.formatDateTime(course.startDatetime)} ?`,
    );

    if (confirmed) {
      this.#courseService.deleteCourse(course.id).subscribe({
        next: () => {
          this.#toastService.show('success', 'Cours supprimé avec succès');
          this.loadCourses();
        },
        error: (err) => {
          console.error('Error deleting course:', err);
          this.#toastService.show('error', 'Erreur lors de la suppression du cours');
        },
      });
    }
  }

  openCreateUserModal() {
    this.#modalService.show('create-course-modal');
  }
}
