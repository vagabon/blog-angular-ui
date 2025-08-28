import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
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
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['setBaseUrl', 'info']);
    apiLoadServiceSpy = jasmine.createSpyObj('ApiLoadService', ['load']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
