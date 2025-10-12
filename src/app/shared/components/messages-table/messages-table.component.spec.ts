import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesTableComponent } from './messages-table.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MessagesTableComponent', () => {
  let component: MessagesTableComponent;
  let fixture: ComponentFixture<MessagesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesTableComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
