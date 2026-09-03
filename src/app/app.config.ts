import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { authInterceptor } from '@ng-vagabond-lab/ng-dsv/module/auth';
import { provideTranslateService } from '@ngx-translate/core';
import { provideMarkdown } from 'ngx-markdown';
import { initializeApp_ } from './app.initializer';
import { routes } from './app.routes';

const firebaseConfig = {
    apiKey: 'AIzaSyDrtu5l_v4aQqlrqoqqrNq9ZvcsnMt8984',
    authDomain: 'blogui-76509.firebaseapp.com',
    projectId: 'blogui-76509',
    storageBucket: 'blogui-76509.firebasestorage.app',
    messagingSenderId: '121875976246',
    appId: '1:121875976246:web:6ea6c60230c62037f98897',
    measurementId: 'G-B8Z1ND3WG6',
};

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
        provideAppInitializer(initializeApp_),
        provideTranslateService({
            fallbackLang: 'fr',
        }),
        provideMarkdown(),
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideMessaging(() => getMessaging()),
    ],
};
