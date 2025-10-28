import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoursesService } from '../../../../chore/services/courses.service';
import { UserService } from '../../../../chore/services/user.service';
import { ModalService } from '../../../../chore/services/modal.service';
import { ToastService } from '../../../../chore/services/toast.service';
import { AuthUser } from '../../../models/authUser';
import { CreateCourse } from '../../../models/course';

@Component({
  selector: 'app-course-creation-form',
  imports: [ReactiveFormsModule],
  templateUrl: './course-creation-form.component.html',
})
export class CourseCreationFormComponent implements OnInit {
  #fb = inject(FormBuilder);
  #courseService = inject(CoursesService);
  #userService = inject(UserService);
  #modalService = inject(ModalService);
  #toastService = inject(ToastService);

  editingCourse = input<CreateCourse | null>(null);

  isLoading = signal(false);
  coaches = signal<AuthUser[]>([]);

  courseForm = this.#fb.group({
    title: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ]),
    description: new FormControl<string>('', [Validators.required]),
    startDatetime: new FormControl<string>('', [Validators.required]),
    duration: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(15),
      Validators.max(180),
    ]),
    personLimit: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(30),
    ]),
    coachId: new FormControl<number | null>(null, [Validators.required]),
  });

  isEditMode = computed(() => this.editingCourse() !== null);

  ngOnInit(): void {
    this.#userService.getCoaches().subscribe({
      next: (coaches) => {
        this.coaches.set(coaches);
      },
      error: (err) => console.log('Error fetching coaches:', err),
    });

    this.setMinDateTime();

    if (this.editingCourse()) {
      this.populateFormForEdit();
    }
  }

  private setMinDateTime() {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    this.courseForm.get('startDatetime')?.setValidators([
      Validators.required,
      (control) => {
        const selectedDate = new Date(control.value);
        return selectedDate > new Date() ? null : { pastDate: true };
      },
    ]);
  }

  async onSubmit() {
    if (this.courseForm.valid) {
      this.isLoading.set(true);

      const formData = this.courseForm.getRawValue();

      if (
        !formData.title ||
        !formData.description ||
        !formData.startDatetime ||
        !formData.duration ||
        !formData.personLimit ||
        !formData.coachId
      ) {
        this.#toastService.show('error', 'Veuillez remplir tous les champs obligatoires');
        this.isLoading.set(false);
        return;
      }

      const courseData: CreateCourse = {
        title: formData.title,
        description: formData.description,
        startDatetime: formData.startDatetime + ':00',
        duration: formData.duration,
        personLimit: formData.personLimit,
        coachId: formData.coachId,
      };

      this.#courseService.createCourse(courseData).subscribe({
        next: () => {
          this.#toastService.show('success', 'Cours créé avec succès');
        },
        error: (err) => {
          console.error('Error creating course:', err);
          this.#toastService.show('error', 'Erreur lors de la création du cours');
        },
        complete: () => {
          this.isLoading.set(false);
          this.closeModal();
        },
      });
    }
  }

  closeModal() {
    this.#modalService.close('create-course-modal');
    this.courseForm.reset();
    this.setMinDateTime();
  }

  populateFormForEdit() {
    const course = this.editingCourse();
    if (!course) return;

    this.courseForm.patchValue({
      title: course.title,
      description: course.description,
      startDatetime: course.startDatetime,
      duration: course.duration,
      personLimit: course.personLimit,
      coachId: course.coachId,
    });
  }
}
