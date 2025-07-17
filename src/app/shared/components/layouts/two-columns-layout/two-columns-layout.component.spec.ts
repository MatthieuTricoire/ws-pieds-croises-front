import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoColumnsLayoutComponent } from './two-columns-layout.component';

describe('TwoColumnsLayoutComponent', () => {
  let component: TwoColumnsLayoutComponent;
  let fixture: ComponentFixture<TwoColumnsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoColumnsLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TwoColumnsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
