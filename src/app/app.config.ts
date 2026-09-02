import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { authInterceptor } from '@ng-vagabond-lab/ng-dsv/module/auth';
import { provideTranslateService } from '@ngx-translate/core';
import { provideMarkdown } from 'ngx-markdown';
import { initializeApp } from './app.initializer';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(
            routes,
            withComponentInputBinding(),
            withInMemoryScrolling({
                scrollPositionRestoration: 'enabled',
            }),
        ),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideClientHydration(),
        provideAppInitializer(initializeApp),
        provideTranslateService({
            fallbackLang: 'fr',
        }),
        provideMarkdown(),
    ],
};
