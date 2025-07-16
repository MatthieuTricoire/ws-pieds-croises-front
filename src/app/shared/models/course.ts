export interface Course {
  id?: number;
  title: string;
  description?: string;
  startDatetime: Date;
  duration: number;
  personLimit: number;
  status: CourseStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum CourseStatus {
  OPEN = 'OPEN',
  FULL = 'FULL',
  CANCELLED = 'CANCELLED',
}
