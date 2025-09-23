import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCreationFormComponent } from './message-creation-form.component';

describe('MessageCreationFormComponent', () => {
  let component: MessageCreationFormComponent;
  let fixture: ComponentFixture<MessageCreationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageCreationFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
