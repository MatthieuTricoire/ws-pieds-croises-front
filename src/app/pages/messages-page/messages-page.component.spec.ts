import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesPageComponent } from './messages-page.component';

describe('MessagesPageComponent', () => {
  let component: MessagesPageComponent;
  let fixture: ComponentFixture<MessagesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
