export interface UserSubscription {
  id: number;
  startDate: string;
  endDate: string;
  freezeDaysRemaining: number;
  userId: number;
  subscriptionId: number;
  subscription: Subscription;
}

export interface Subscription {
  id: number;
  name: string;
  price: number;
  sessionPerWeek?: number;
  duration: number;
  freezeDaysAllowed: number;
  terminationConditions?: string;
  // box?: Box;
  userSubscriptions?: UserSubscription[];
}
