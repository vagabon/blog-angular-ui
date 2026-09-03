import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Service } from '@angular/core';
import { getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { AuthService } from '@ng-vagabond-lab/ng-dsv/module/auth';

@Service()
export class NotificationPushService {
    private platformId = inject(PLATFORM_ID);
    private messaging = inject(Messaging);
    private authService = inject(AuthService);

    async registerAndGetToken(): Promise<string | null> {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log(registration);

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
