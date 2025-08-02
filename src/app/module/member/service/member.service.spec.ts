import { HttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@ng-vagabond-lab/ng-dsv/api';
import { of } from 'rxjs';
import { MemberService } from './member.service';

describe('MemberService', () => {
  let service: MemberService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    let httpClientSpyObj = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        MemberService,
        {
          provide: HttpClient,
          useValue: httpClientSpyObj,
        },
      ],
    });

    const apiService = TestBed.inject(ApiService);
    apiService.setBaseUrl('http://localhost:3000/api/');
    service = TestBed.inject(MemberService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call ApiService.get when initMember is called', () => {
    const userId = '123';
    const memberData = { id: 1, name: 'John Doe' };

    httpClientSpy.get.and.returnValue(of(memberData));

    service.initMember(userId);

    expect(httpClientSpy.get).toHaveBeenCalledWith(
      `http://localhost:3000/api/member/user/${userId}`
    );
    expect(service.member()).toBe(memberData);
  });

  it('should call ApiService.get when initMember is called', () => {
    const userId = '123';
    const memberData = { id: null };

    httpClientSpy.get.and.returnValue(of(memberData));
    httpClientSpy.post.and.returnValue(of(memberData));

    service.initMember(userId);

    expect(httpClientSpy.get).toHaveBeenCalledWith(
      `http://localhost:3000/api/member/user/${userId}`
    );
    expect(httpClientSpy.post).toHaveBeenCalled();
    expect(service.member()).toBe(memberData);
  });
});
