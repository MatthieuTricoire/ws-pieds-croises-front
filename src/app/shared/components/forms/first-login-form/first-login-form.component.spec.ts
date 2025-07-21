import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstLoginFormComponent } from './first-login-form.component';

describe('FirstLoginFormComponent', () => {
  let component: FirstLoginFormComponent;
  let fixture: ComponentFixture<FirstLoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstLoginFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FirstLoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
