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
  userId: number;
  subscriptionId: number;
  startDate: string;
  endDate: string;
  freezeDaysRemaining: number;
  subscription: Subscription;
}

export interface SubscriptionValidation {
  isValid: boolean;
  canRegister: boolean;
  reason?: string;
  weeklyRegistrations?: number;
  weeklyLimit?: number;
}
