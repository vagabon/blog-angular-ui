import { isPlatformBrowser } from '@angular/common';
import { Component, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { RouterOutlet } from '@angular/router';
import { BaseMainContainer } from '@ng-vagabond-lab/ng-dsv/base';
import { DsvContainerComponent } from '@ng-vagabond-lab/ng-dsv/ds/container';
import { DsvHeaderComponent } from '@ng-vagabond-lab/ng-dsv/ds/header';
import { LinearProgressComponent } from '@ng-vagabond-lab/ng-dsv/ds/linear-progress';
import { MenuService } from '@ng-vagabond-lab/ng-dsv/ds/menu';
import { DsvScrollInfiniteContainer } from '@ng-vagabond-lab/ng-dsv/ds/scroll';
import { DsvThemeComponent } from '@ng-vagabond-lab/ng-dsv/ds/theme';
import { DsvToastComponent } from '@ng-vagabond-lab/ng-dsv/ds/toast';
import { AuthComponent, AuthService } from '@ng-vagabond-lab/ng-dsv/module/auth';
import {
    NotificationButtonContainer,
    NotificationService,
} from '@ng-vagabond-lab/ng-dsv/module/notification';
import { FooterComponent, MenuContainer, MenuDto } from '@ng-vagabond-lab/ng-dsv/template';
import { menu } from './conf/menu.conf';

@Component({
    selector: 'app-root',
    imports: [
        DsvThemeComponent,
        LinearProgressComponent,
        DsvContainerComponent,
        DsvToastComponent,
        DsvScrollInfiniteContainer,
        DsvHeaderComponent,
        AuthComponent,
        MenuContainer,
        FooterComponent,
        RouterOutlet,
        NotificationButtonContainer,
    ],
    templateUrl: './app.component.html',
})
export class AppComponent extends BaseMainContainer {
    readonly menuService = inject(MenuService);
    readonly notificationService = inject(NotificationService);
    readonly fcmNotificationService = inject(FcmNotificationService);

    readonly menu = signal<MenuDto>(menu);

    constructor() {
        super();
        effect(() => {
            if (this.authService.userConnected() && this.routerService.currentUrl()) {
                this.notificationService.fetchNbRead();
            }
        });
        effect(() => {
            if (this.authService.userConnected()) {
                this.fcmNotificationService.registerAndGetToken();
                this.fcmNotificationService.listenForeground();

                this.authService.apiService.post('/notification/send', {}, (data) => console.log(data));
            }
        });
    }
}

@Injectable({ providedIn: 'root' })
export class FcmNotificationService {
    private platformId = inject(PLATFORM_ID);
    private messaging = inject(Messaging);
    private authService = inject(AuthService);

    async registerAndGetToken(): Promise<string | null> {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

        const token = await getToken(this.messaging, {
            vapidKey:
                'BABz3sjgsFLZmHK6F1HZ3gktG-48JXPJPmDLn1yvKJMIJTa_WGzDVb-xvxQN_7a9qo06jM7YE-BKU1P4a7COaZY',
            serviceWorkerRegistration: registration,
        });

        this.authService.apiService.put('/notification/token/user', {
            userId: this.authService.userConnected()!.id,
            token: token,
        });
        return token;
    }

    listenForeground() {
        onMessage(this.messaging, (payload) => {
            alert(`Notification reçue : ${payload.notification?.title} - ${payload.notification?.body}`);
        });
    }
}
