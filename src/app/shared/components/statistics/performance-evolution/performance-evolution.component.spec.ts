import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceEvolutionComponent } from './performance-evolution.component';

describe('PerformanceEvolutionComponent', () => {
  let component: PerformanceEvolutionComponent;
  let fixture: ComponentFixture<PerformanceEvolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceEvolutionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PerformanceEvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
