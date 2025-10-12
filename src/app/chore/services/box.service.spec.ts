import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { BoxService } from './box.service';
import { HttpClient } from '@angular/common/http';
import { BoxInfo } from '../../shared/models/boxInfo';

describe('BoxService', () => {
  let service: BoxService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  const mockBox: BoxInfo = {
    id: 1,
    name: 'Main box',
    email: 'contact@mainbox.test',
    phoneNumber: '0102030405',
    address: '1 rue du Test',
    zipcode: '75000',
    city: 'Paris',
    schedule: 'Lun-Ven 9:00-18:00',
  } as unknown as BoxInfo;

  const updatedBox: BoxInfo = {
    id: 1,
    name: 'Updated box',
    email: 'contact@updatedbox.test',
    phoneNumber: '0607080910',
    address: '2 avenue Test',
    zipcode: '75001',
    city: 'Paris',
    schedule: 'Lun-Ven 8:00-17:00',
  } as unknown as BoxInfo;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'put']);
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpSpy }],
    });
    service = TestBed.inject(BoxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetchBoxInfo should call GET and set boxSignal on success', () => {
    httpSpy.get.and.returnValue(of(mockBox));

    expect(service.boxSignal()).toBeNull();

    service.fetchBoxInfo();

    expect(httpSpy.get).toHaveBeenCalledWith('http://localhost:8080/box/box-info', {
      withCredentials: true,
    });
    expect(service.boxSignal()).toEqual(mockBox);
  });

  it('fetchBoxInfo should log error when GET fails', () => {
    const err = new Error('fail');
    httpSpy.get.and.returnValue(throwError(() => err));
    spyOn(console, 'error');

    service.fetchBoxInfo();

    expect(console.error).toHaveBeenCalledWith('Error while loading the box', err);
  });

  it('updateBoxInfo should call PUT and set boxSignal on success', () => {
    httpSpy.put.and.returnValue(of(updatedBox));

    service.updateBoxInfo(updatedBox);

    expect(httpSpy.put).toHaveBeenCalledWith('http://localhost:8080/box/box-info', updatedBox, {
      withCredentials: true,
    });
    expect(service.boxSignal()).toEqual(updatedBox);
  });

  it('updateBoxInfo should log error when PUT fails', () => {
    const err = new Error('put fail');
    httpSpy.put.and.returnValue(throwError(() => err));
    spyOn(console, 'error');

    service.updateBoxInfo(updatedBox);

    expect(console.error).toHaveBeenCalledWith('Error while updating the box', err);
  });
});
