import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { SubscriptionFormComponent } from './subscription-form.component';
import { SubscriptionService } from '../../../../chore/services/subscription.service';
import { ModalService } from '../../../../chore/services/modal.service';
import { ToastService } from '../../../../chore/services/toast.service';
import { Subscription } from '../../../models/user-subscription';

describe('SubscriptionFormComponent', () => {
  let component: SubscriptionFormComponent;
  let fixture: ComponentFixture<SubscriptionFormComponent>;
  let subscriptionServiceSpy: jasmine.SpyObj<SubscriptionService>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const mockSubscription: Subscription = {
    id: 1,
    name: 'Abonnement Test',
    sessionPerWeek: 2,
    duration: 30,
    freezeDaysAllowed: 5,
    price: 50,
  };

  beforeEach(async () => {
    // Création des espions pour les services
    subscriptionServiceSpy = jasmine.createSpyObj('SubscriptionService', [
      'createSubscription',
      'updateSubscription',
    ]);
    modalServiceSpy = jasmine.createSpyObj('ModalService', ['close']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    // Configuration des retours des méthodes espionnées
    subscriptionServiceSpy.createSubscription.and.returnValue(of(mockSubscription));
    subscriptionServiceSpy.updateSubscription.and.returnValue(of(mockSubscription));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SubscriptionFormComponent],
      providers: [
        { provide: SubscriptionService, useValue: subscriptionServiceSpy },
        { provide: ModalService, useValue: modalServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
