import { ApplicationConfig, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { authInterceptor } from '@ng-vagabond-lab/ng-dsv/api';
import { provideTranslateService } from '@ngx-translate/core';
import { initializeApp } from './app.initializer';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor('-popcorn')]),
    ),
    provideClientHydration(),
    provideAppInitializer(initializeApp),
    provideTranslateService({
      fallbackLang: 'fr',
    }),
  ],
};
