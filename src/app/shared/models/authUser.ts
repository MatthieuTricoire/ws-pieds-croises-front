export type Role = 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_COACH';

export interface AuthUser {
  email: string;
  role: Role;
  exp: number;
}
