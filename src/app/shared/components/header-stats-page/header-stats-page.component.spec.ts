import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderStatsPageComponent } from './header-stats-page.component';

describe('HeaderStatsPageComponent', () => {
  let component: HeaderStatsPageComponent;
  let fixture: ComponentFixture<HeaderStatsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderStatsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderStatsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
