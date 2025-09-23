import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreationFormComponent } from './user-creation-form.component';

describe('UserCreationFormComponent', () => {
  let component: UserCreationFormComponent;
  let fixture: ComponentFixture<UserCreationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreationFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
