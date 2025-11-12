import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightEvolutionComponent } from './weight-evolution.component';

describe('WeightEvolutionComponent', () => {
  let component: WeightEvolutionComponent;
  let fixture: ComponentFixture<WeightEvolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeightEvolutionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeightEvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
