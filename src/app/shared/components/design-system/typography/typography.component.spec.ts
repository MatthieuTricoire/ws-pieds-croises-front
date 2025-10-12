import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TypographyComponent } from './typography.component';

describe('TypographyComponent', () => {
  let component: TypographyComponent;
  let fixture: ComponentFixture<TypographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypographyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TypographyComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('text', 'Test text');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have required text input', () => {
    expect(component.text()).toBe('Test text');
  });

  it('should have default tagType as p', () => {
    expect(component.tagType()).toBe('p');
  });

  it('should have empty className by default', () => {
    expect(component.className()).toBe('');
  });

  describe('HTML Tag Generation', () => {
    it('should render h1 tag when tagType is h1', () => {
      fixture.componentRef.setInput('tagType', 'h1');
      fixture.componentRef.setInput('text', 'Main Title');
      fixture.detectChanges();

      const h1Element = fixture.debugElement.query(By.css('h1'));
      expect(h1Element).toBeDefined();
      expect(h1Element.nativeElement.textContent).toBe('Main Title');
    });

    it('should render h2 tag when tagType is h2', () => {
      fixture.componentRef.setInput('tagType', 'h2');
      fixture.componentRef.setInput('text', 'Section Title');
      fixture.detectChanges();

      const h2Element = fixture.debugElement.query(By.css('h2'));
      expect(h2Element).toBeDefined();
      expect(h2Element.nativeElement.textContent).toBe('Section Title');
    });

    it('should render h3 tag when tagType is h3', () => {
      fixture.componentRef.setInput('tagType', 'h3');
      fixture.componentRef.setInput('text', 'Subsection Title');
      fixture.detectChanges();

      const h3Element = fixture.debugElement.query(By.css('h3'));
      expect(h3Element).toBeDefined();
      expect(h3Element.nativeElement.textContent).toBe('Subsection Title');
    });

    it('should render h4 tag when tagType is h4', () => {
      fixture.componentRef.setInput('tagType', 'h4');
      fixture.componentRef.setInput('text', 'Small Title');
      fixture.detectChanges();

      const h4Element = fixture.debugElement.query(By.css('h4'));
      expect(h4Element).toBeDefined();
      expect(h4Element.nativeElement.textContent).toBe('Small Title');
    });

    it('should render p tag when tagType is p', () => {
      fixture.componentRef.setInput('tagType', 'p');
      fixture.componentRef.setInput('text', 'Paragraph text');
      fixture.detectChanges();

      const pElement = fixture.debugElement.query(By.css('p'));
      expect(pElement).toBeDefined();
      expect(pElement.nativeElement.textContent).toBe('Paragraph text');
    });

    it('should render span tag when tagType is span', () => {
      fixture.componentRef.setInput('tagType', 'span');
      fixture.componentRef.setInput('text', 'Inline text');
      fixture.detectChanges();

      const spanElement = fixture.debugElement.query(By.css('span'));
      expect(spanElement).toBeDefined();
      expect(spanElement.nativeElement.textContent).toBe('Inline text');
    });

    it('should render div tag as default fallback', () => {
      fixture.componentRef.setInput('tagType', 'invalid');
      fixture.componentRef.setInput('text', 'Default text');
      fixture.detectChanges();

      const divElement = fixture.debugElement.query(By.css('div'));
      expect(divElement).toBeDefined();
      expect(divElement.nativeElement.textContent).toBe('Default text');
    });
  });

  describe('CSS Classes Computed', () => {
    it('should apply correct classes for h1', () => {
      fixture.componentRef.setInput('tagType', 'h1');
      fixture.detectChanges();

      expect(component.finalClass()).toContain('text-6xl');
      expect(component.finalClass()).toContain('max-sm:text-4xl');
      expect(component.finalClass()).toContain('font-bold');
    });

    it('should apply correct classes for h2', () => {
      fixture.componentRef.setInput('tagType', 'h2');
      fixture.detectChanges();

      expect(component.finalClass()).toContain('text-4xl');
      expect(component.finalClass()).toContain('max-sm:text-3xl');
      expect(component.finalClass()).toContain('font-semibold');
    });

    it('should apply correct classes for h3', () => {
      fixture.componentRef.setInput('tagType', 'h3');
      fixture.detectChanges();

      expect(component.finalClass()).toContain('text-3xl');
      expect(component.finalClass()).toContain('max-sm:text-2xl');
      expect(component.finalClass()).toContain('font-semibold');
    });

    it('should apply correct classes for h4', () => {
      fixture.componentRef.setInput('tagType', 'h4');
      fixture.detectChanges();

      expect(component.finalClass()).toContain('text-2xl');
      expect(component.finalClass()).toContain('max-sm:text-xl');
      expect(component.finalClass()).toContain('font-semibold');
    });

    it('should apply correct classes for p', () => {
      fixture.componentRef.setInput('tagType', 'p');
      fixture.detectChanges();

      expect(component.finalClass()).toContain('text-base');
      expect(component.finalClass()).not.toContain('font-semibold');
    });

    it('should apply correct classes for span', () => {
      fixture.componentRef.setInput('tagType', 'span');
      fixture.detectChanges();

      expect(component.finalClass()).toContain('text-base');
      expect(component.finalClass()).toContain('font-semibold');
    });

    it('should apply default classes for invalid tagType', () => {
      fixture.componentRef.setInput('tagType', 'invalid');
      fixture.detectChanges();

      expect(component.finalClass()).toContain('text-base');
    });

    it('should append custom className to computed classes', () => {
      fixture.componentRef.setInput('tagType', 'h1');
      fixture.componentRef.setInput('className', 'text-red-500 custom-class');
      fixture.detectChanges();

      const finalClass = component.finalClass();
      expect(finalClass).toContain('text-6xl');
      expect(finalClass).toContain('font-bold');
      expect(finalClass).toContain('text-red-500');
      expect(finalClass).toContain('custom-class');
    });
  });

  describe('DOM Integration', () => {
    it('should apply computed classes to DOM element', () => {
      fixture.componentRef.setInput('tagType', 'h2');
      fixture.componentRef.setInput('className', 'custom-class');
      fixture.detectChanges();

      const h2Element = fixture.debugElement.query(By.css('h2'));
      const classList = h2Element.nativeElement.className;

      expect(classList).toContain('text-4xl');
      expect(classList).toContain('max-sm:text-3xl');
      expect(classList).toContain('font-semibold');
      expect(classList).toContain('custom-class');
    });
  });
});
