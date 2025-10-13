export type userSubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';

export interface Subscription {
  id: number;
  name: string;
  sessionPerWeek: number;
  duration: number;
  freezeDaysAllowed: number;
  price: number;
}

export interface UserSubscription {
  id: number;
  startDate: Date;
  endDate: Date;
  freezeDaysRemaining: number;
  userId: number;
  subscriptionId: number;
  subscription: Subscription;
  status: userSubscriptionStatus;
}

export interface SubscriptionValidation {
  isValid: boolean;
  canRegister: boolean;
  reason?: string;
  weeklyRegistrations?: number;
  weeklyLimit?: number;
}
