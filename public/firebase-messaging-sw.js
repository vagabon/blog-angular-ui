importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: 'AIzaSyDrtu5l_v4aQqlrqoqqrNq9ZvcsnMt8984',
    authDomain: 'blogui-76509.firebaseapp.com',
    projectId: 'blogui-76509',
    storageBucket: 'blogui-76509.firebasestorage.app',
    messagingSenderId: '121875976246',
    appId: '1:121875976246:web:6ea6c60230c62037f98897',
    measurementId: 'G-B8Z1ND3WG6',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification?.title || 'Notification';

    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/images/logo.png',
        data: {
            url: payload.data?.url || '/',
        },
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    const targetUrl = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let client of windowClients) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.focus();
                    return client.navigate(targetUrl);
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        }),
    );
});
