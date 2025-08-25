export type Role = 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_COACH';

export interface AuthUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  roles: Role[];
}
