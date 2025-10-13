import { UserSubscription } from './user-subscription';

export type Role = 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_COACH';

export interface AuthUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  profilePicture: string | null;
  roles: Role[];
  createdAt: Date;
  userSubscriptions: UserSubscription[];
}

export interface CreateUser {
  firstname: string;
  lastname: string;
  email: string;
  roles: Role[];
  phone: string;
  subscriptionId?: string;
}
