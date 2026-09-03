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
    apiKey: 'AIzaSyAM-G716kTyIgUcR0ew54gV5hQWzm4EbVo',
    authDomain: 'blogui-76509.firebaseapp.com',
    projectId: 'blogui-76509',
    storageBucket: 'blogui-76509.firebasestorage.app',
    messagingSenderId: '121875976246',
    appId: '1:121875976246:web:b673a138831a5fcaf98897',
    measurementId: 'G-39NLDJNQB0',
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
