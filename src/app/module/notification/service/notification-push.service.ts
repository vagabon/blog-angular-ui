import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Service, signal } from '@angular/core';
import { Messaging, onMessage, onRegistered, register } from '@angular/fire/messaging';
import { AuthService } from '@ng-vagabond-lab/ng-dsv/module/auth';

@Service()
export class NotificationPushService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly messaging = inject(Messaging);
    private readonly authService = inject(AuthService);

    private readonly userNotificationToken = signal<string | null>(null);

    async registerAndGetToken(): Promise<void | null> {
        if (!isPlatformBrowser(this.platformId) || this.userNotificationToken() !== null) {
            return null;
        }

        onRegistered(this.messaging, (token) => {
            this.userNotificationToken.set(token);

            this.authService.apiService.put('/notifications/tokens/user', {
                userId: this.authService.userConnected()!.id,
                token: token,
            });
        });

        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

        return await register(this.messaging, {
            vapidKey:
                'BABz3sjgsFLZmHK6F1HZ3gktG-48JXPJPmDLn1yvKJMIJTa_WGzDVb-xvxQN_7a9qo06jM7YE-BKU1P4a7COaZY',
            serviceWorkerRegistration: registration,
        });
    }

    listenForeground() {
        onMessage(this.messaging, (payload) => {
            alert(`Notification reçue : ${payload.notification?.title} - ${payload.notification?.body}`);
        });
    }
}
