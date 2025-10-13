import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCreationFormComponent } from './message-creation-form.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MessageCreationFormComponent', () => {
  let component: MessageCreationFormComponent;
  let fixture: ComponentFixture<MessageCreationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageCreationFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
