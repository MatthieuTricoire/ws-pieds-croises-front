type CourseStatus = 'OPEN' | 'FULL' | 'CANCELLED';

export interface Course {
  id: number;
  title: string;
  description: string;
  startDatetime: Date;
  duration: number;
  personLimit: number;
  status: CourseStatus;
  usersId: number[];
  coachName: string;
  coachId: number;
}
