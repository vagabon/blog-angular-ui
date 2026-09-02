/// <reference types="vitest/globals" />

import { provideZonelessChangeDetection } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { routes } from 'app/app.routes';
import { vi } from 'vitest';

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
});

getTestBed().configureTestingModule({
    providers: [provideZonelessChangeDetection(), provideTranslateService(), provideRouter(routes)],
});

console.error = vi.fn();
