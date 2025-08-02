import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiLoadService, ApiService } from '@ng-vagabond-lab/ng-dsv/api';
import { EnvironmentService } from '@ng-vagabond-lab/ng-dsv/environment';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let apiLoadServiceSpy: jasmine.SpyObj<ApiLoadService>;
  let envServiceMock: Partial<EnvironmentService>;

  beforeEach(async () => {
    (window as any).google = {
      accounts: { id: { prompt: () => { }, initialize: () => { }, renderButton: () => { } } }
    };
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['setBaseUrl']);
    apiLoadServiceSpy = jasmine.createSpyObj('ApiLoadService', ['load']);
    apiServiceSpy.apiLoadService = apiLoadServiceSpy;
    envServiceMock = {
      env: signal({
        APP_NAME: 'PopCorn TEST',
        API_URL: 'https://api.example.com',
        GOOGLE_CLIENT_ID: 'GOOGLE_CLIENT_ID',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: EnvironmentService, useValue: envServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should call setBaseUrl when env is defined', () => {
    expect(apiServiceSpy.setBaseUrl).toHaveBeenCalledWith(
      'https://api.example.com'
    );
    expect(component.load()).toBeTrue();
  });
});
