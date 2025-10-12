import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Message } from '../../shared/models/message';

type CreateMessageData = Omit<Message, 'id' | 'messageStatus' | 'messageTypeLabel'>;

describe('MessageService', () => {
  let service: MessageService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  const apiUrl = 'http://localhost:8080/messages';

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'patch', 'delete', 'post']);
    TestBed.configureTestingModule({
      providers: [MessageService, { provide: HttpClient, useValue: httpClientSpy }],
    });
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  describe('loadAllMessages', () => {
    it('should load and transform messages on success', (done) => {
      const messages: Message[] = [
        {
          id: '1',
          title: 'Titre',
          messageType: 'INFORMATION',
          messageStatus: 'ACTIVE',
          content: 'test',
        },
      ];
      httpClientSpy.get.and.returnValue(of(messages));
      service.loadAllMessages().subscribe(() => {
        expect(service.messages()).toEqual([{ ...messages[0], messageTypeLabel: 'Info' }]);
        expect(service.loading()).toBeFalse();
        expect(service.error()).toBeNull();
        done();
      });
    });

    it('should set error and loading on failure', (done) => {
      httpClientSpy.get.and.returnValue(throwError(() => new Error('fail')));
      service.loadAllMessages().subscribe(() => {
        expect(service.messages()).toEqual([]);
        expect(service.loading()).toBeFalse();
        expect(service.error()).toBe('Erreur lors du chargement des messages');
        done();
      });
    });
  });

  it('should get all messages', (done) => {
    const messages: Message[] = [
      {
        id: '1',
        title: 'Titre',
        messageType: 'INFORMATION',
        messageStatus: 'ACTIVE',
        content: 'test',
      },
    ];
    httpClientSpy.get.and.returnValue(of(messages));
    service.getAllMessages().subscribe((result) => {
      expect(result).toEqual(messages);
      expect(httpClientSpy.get).toHaveBeenCalledWith(apiUrl, { withCredentials: true });
      done();
    });
  });

  it('should update message status', (done) => {
    const message: Message = {
      id: '1',
      title: 'Titre',
      messageType: 'INFORMATION',
      messageStatus: 'ACTIVE',
      content: 'test',
    };
    httpClientSpy.patch.and.returnValue(of(message));
    service.updateMessageStatus('1', 'ACTIVE').subscribe((result) => {
      expect(result).toEqual(message);
      expect(httpClientSpy.patch).toHaveBeenCalledWith(`${apiUrl}/1/status?status=ACTIVE`, null, {
        withCredentials: true,
      });
      done();
    });
  });

  it('should delete message', (done) => {
    httpClientSpy.delete.and.returnValue(of(undefined));
    service.deleteMessage('1').subscribe((result) => {
      expect(result).toBeUndefined();
      expect(httpClientSpy.delete).toHaveBeenCalledWith(`${apiUrl}/1`, { withCredentials: true });
      done();
    });
  });

  it('should create message', (done) => {
    const message: Message = {
      id: '1',
      title: 'Titre',
      messageType: 'INFORMATION',
      messageStatus: 'ACTIVE',
      content: 'test',
    };
    const messageData: CreateMessageData = {
      title: 'Titre',
      messageType: 'INFORMATION',
      content: 'test',
    };
    httpClientSpy.post.and.returnValue(of(message));
    service.createMessage(messageData).subscribe((result) => {
      expect(result).toEqual(message);
      expect(httpClientSpy.post).toHaveBeenCalledWith(apiUrl, messageData, {
        withCredentials: true,
      });
      done();
    });
  });
});
