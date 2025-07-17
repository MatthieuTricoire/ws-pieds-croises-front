export interface Subscription {
  id?: number;
  name: string;
  price: number;
  sessionPerWeek?: number;
  duration: number;
  freezeDaysAllowed: number;
  terminationConditions?: string;
  // box?: Box;
  // userSubscriptions?: UserSubscription[];
}
