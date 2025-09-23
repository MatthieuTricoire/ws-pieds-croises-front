import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesTableComponent } from './messages-table.component';

describe('MessagesTableComponent', () => {
  let component: MessagesTableComponent;
  let fixture: ComponentFixture<MessagesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
