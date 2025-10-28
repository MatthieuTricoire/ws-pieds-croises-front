export type CourseStatus = 'OPEN' | 'FULL' | 'CANCELLED';

export interface UserCourseInfo {
  userId: number;
  status: 'REGISTERED' | 'WAITING_LIST';
}

export interface Course {
  id: number;
  title: string;
  description: string;
  startDatetime: Date;
  duration: number;
  personLimit: number;
  status: CourseStatus;
  coachName: string;
  coachId: number;
  userCoursesInfo: UserCourseInfo[];
  usersId: number[];
}

export interface CreateCourse {
  title: string;
  description: string;
  startDatetime: string;
  duration: number;
  personLimit: number;
  coachId: number;
}
