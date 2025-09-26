import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { AuthUser, CreateUser } from '../../shared/models/authUser';
import { Course } from '../../shared/models/course';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/users';

  const mockAuthUser: AuthUser = {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    roles: ['ROLE_USER'],
    phone: '0123456789',
    photoUrl: 'https://example.com/photo.jpg',
    userSubscriptions: [],
  };

  const mockCreateUser: CreateUser = {
    firstname: 'Jane',
    lastname: 'Smith',
    email: 'jane.smith@example.com',
    roles: ['ROLE_USER'],
    phone: '0987654321',
    subscriptionId: 'sub123',
  };

  const mockCourse: Course = {
    id: 1,
    title: 'Yoga Class',
    description: 'Relaxing yoga session',
    startDatetime: new Date('2024-01-15T10:00:00Z'),
    duration: 60,
    personLimit: 15,
    status: 'OPEN',
    usersId: [1, 2],
    coachName: 'Coach Anna',
    coachId: 5,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with empty state', () => {
      expect(service.users()).toEqual([]);
      expect(service.error()).toBeNull();
      expect(service.loading()).toBeFalse();
    });

    it('should have readonly signals', () => {
      expect(typeof service.users).toBe('function');
      expect(typeof service.error).toBe('function');
      expect(typeof service.loading).toBe('function');
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', (done) => {
      expect(service.loading()).toBeFalse();

      service.createUser(mockCreateUser).subscribe({
        next: (user) => {
          expect(user).toEqual(mockAuthUser);
          expect(service.users()).toContain(mockAuthUser);
          expect(service.loading()).toBeFalse();
          expect(service.error()).toBeNull();
          done();
        },
      });

      expect(service.loading()).toBeTrue();
      expect(service.error()).toBeNull();

      const req = httpMock.expectOne(`${apiUrl}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateUser);
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockAuthUser);
    });

    it('should handle creation error', (done) => {
      const errorMessage = 'Server error';

      service.createUser(mockCreateUser).subscribe({
        error: () => {
          expect(service.error()).toBe('Error during user creation');
          expect(service.loading()).toBeFalse();
          expect(service.users()).toEqual([]);
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}`);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });

    it('should add user to existing users list', (done) => {
      service.loadAllUsers().subscribe();
      const loadReq = httpMock.expectOne(`${apiUrl}`);
      loadReq.flush([mockAuthUser]);

      const newUser: AuthUser = { ...mockAuthUser, id: 2, firstname: 'Jane' };

      service.createUser(mockCreateUser).subscribe({
        next: () => {
          expect(service.users().length).toBe(2);
          expect(service.users()).toContain(newUser);
          done();
        },
      });

      const createReq = httpMock.expectOne(`${apiUrl}`);
      createReq.flush(newUser);
    });
  });

  describe('loadAllUsers', () => {
    it('should load all users successfully', (done) => {
      const mockUsers = [mockAuthUser, { ...mockAuthUser, id: 2, firstname: 'Jane' }];

      service.loadAllUsers().subscribe({
        next: (users) => {
          expect(users).toEqual(mockUsers);
          expect(service.users()).toEqual(mockUsers);
          expect(service.loading()).toBeFalse();
          expect(service.error()).toBeNull();
          done();
        },
      });

      expect(service.loading()).toBeTrue();

      const req = httpMock.expectOne(`${apiUrl}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockUsers);
    });

    it('should handle loading error and return empty array', (done) => {
      service.loadAllUsers().subscribe({
        next: (users) => {
          expect(users).toEqual([]);
          expect(service.error()).toBe('Error during users loading');
          expect(service.loading()).toBeFalse();
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}`);
      req.flush('Error', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('updateUser', () => {
    beforeEach((done) => {
      service.loadAllUsers().subscribe(() => done());
      const req = httpMock.expectOne(`${apiUrl}`);
      req.flush([mockAuthUser]);
    });

    it('should update user successfully', (done) => {
      const updateData = { firstname: 'John Updated' };
      const updatedUser = { ...mockAuthUser, ...updateData };

      service.updateUser(1, updateData).subscribe({
        next: (user) => {
          expect(user).toEqual(updatedUser);
          expect(service.users().find((u) => u.id === 1)).toEqual(updatedUser);
          expect(service.loading()).toBeFalse();
          expect(service.error()).toBeNull();
          done();
        },
      });

      expect(service.loading()).toBeTrue();

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      expect(req.request.withCredentials).toBeTrue();

      req.flush(updatedUser);
    });

    it('should handle update error', (done) => {
      const updateData = { firstname: 'John Updated' };

      service.updateUser(1, updateData).subscribe({
        error: () => {
          expect(service.error()).toBe('Error during user update');
          expect(service.loading()).toBeFalse();
          expect(service.users().find((u) => u.id === 1)).toEqual(mockAuthUser);
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      req.flush('Error', { status: 400, statusText: 'Bad Request' });
    });

    it('should not update non-existing user', (done) => {
      const updateData = { firstname: 'Non Existing' };
      const updatedUser = { ...mockAuthUser, id: 999, ...updateData };

      service.updateUser(999, updateData).subscribe({
        next: () => {
          expect(service.users().find((u) => u.id === 999)).toBeUndefined();
          expect(service.users().find((u) => u.id === 1)).toEqual(mockAuthUser);
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', (done) => {
      service.deleteUser(1).subscribe({
        next: () => {
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(null);
    });

    it('should handle delete error', (done) => {
      service.deleteUser(1).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      req.flush('Error', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getUserCourses', () => {
    it('should get user courses with date conversion', (done) => {
      const mockCoursesResponse = [
        {
          ...mockCourse,
          startDatetime: '2024-01-15T10:00:00Z',
        },
      ];

      service.getUserCourses().subscribe({
        next: (courses) => {
          expect(courses.length).toBe(1);
          expect(courses[0].id).toBe(mockCourse.id);
          expect(courses[0].title).toBe(mockCourse.title);
          expect(courses[0].startDatetime instanceof Date).toBeTrue();
          expect(courses[0].startDatetime.toISOString()).toBe('2024-01-15T10:00:00.000Z');
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/courses`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockCoursesResponse);
    });

    it('should handle courses loading error', (done) => {
      service.getUserCourses().subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/courses`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });

    it('should handle multiple courses with date conversion', (done) => {
      const mockCoursesResponse = [
        { ...mockCourse, id: 1, startDatetime: '2024-01-15T10:00:00Z' },
        { ...mockCourse, id: 2, startDatetime: '2024-01-16T14:30:00Z' },
      ];

      service.getUserCourses().subscribe({
        next: (courses) => {
          expect(courses.length).toBe(2);
          courses.forEach((course) => {
            expect(course.startDatetime instanceof Date).toBeTrue();
          });

          expect(courses[1].startDatetime.getUTCHours()).toBe(14);
          expect(courses[1].startDatetime.getUTCMinutes()).toBe(30);
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/courses`);
      req.flush(mockCoursesResponse);
    });
  });

  describe('Signal State Management', () => {
    it('should manage loading state correctly across operations', (done) => {
      expect(service.loading()).toBeFalse();

      service.createUser(mockCreateUser).subscribe();
      expect(service.loading()).toBeTrue();

      const req = httpMock.expectOne(`${apiUrl}`);
      req.flush(mockAuthUser);

      setTimeout(() => {
        expect(service.loading()).toBeFalse();
        done();
      }, 0);
    });

    it('should reset error state on new operations', (done) => {
      service.createUser(mockCreateUser).subscribe({
        error: () => {
          expect(service.error()).toBe('Error during user creation');

          service.loadAllUsers().subscribe(() => {
            expect(service.error()).toBeNull();
            done();
          });

          const loadReq = httpMock.expectOne(`${apiUrl}`);
          loadReq.flush([mockAuthUser]);
        },
      });

      const createReq = httpMock.expectOne(`${apiUrl}`);
      createReq.flush('Error', { status: 400, statusText: 'Bad Request' });
    });
  });
});
