import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnvironmentService } from '@ng-vagabond-lab/ng-dsv/environment';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let envServiceMock: Partial<EnvironmentService>;

  beforeEach(async () => {
    (window as any).google = {
      accounts: { id: { prompt: () => { }, initialize: () => { }, renderButton: () => { } } }
    };
    envServiceMock = {
      env: signal({
        APP_NAME: 'Blog TEST',
        API_URL: 'https://api.example.com',
        GOOGLE_CLIENT_ID: 'GOOGLE_CLIENT_ID',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
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

});
