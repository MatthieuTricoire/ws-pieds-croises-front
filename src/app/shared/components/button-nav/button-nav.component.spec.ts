import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonNavComponent } from './button-nav.component';

describe('ButtonNavComponent', () => {
  let component: ButtonNavComponent;
  let fixture: ComponentFixture<ButtonNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonNavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
