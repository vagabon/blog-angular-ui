import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { AuthService } from '@ng-vagabond-lab/ng-dsv/module/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationPushService } from './notification-push.service';

vi.mock('@angular/fire/messaging', () => ({
    Messaging: vi.fn(),
    getToken: vi.fn(),
    onMessage: vi.fn((messaging, nextOrObserver) => {}),
}));

describe('NotificationPushService', () => {
    let service: NotificationPushService;
    let mockAuthService: {
        userConnected: ReturnType<typeof vi.fn>;
        apiService: {
            put: ReturnType<typeof vi.fn>;
        };
    };
    let mockMessaging: Messaging;
    let mockServiceWorkerRegistration: ServiceWorkerRegistration;

    beforeEach(() => {
        vi.clearAllMocks();

        mockMessaging = {} as Messaging;
        mockServiceWorkerRegistration = {} as ServiceWorkerRegistration;

        mockAuthService = {
            userConnected: vi.fn().mockReturnValue({ id: 'user-123' }),
            apiService: {
                put: vi.fn(),
            },
        };

        // Mock global du navigator.serviceWorker.register
        Object.defineProperty(globalThis.navigator, 'serviceWorker', {
            value: {
                register: vi.fn().mockResolvedValue(mockServiceWorkerRegistration),
            },
            writable: true,
            configurable: true,
        });

        // Mock global de alert()
        vi.stubGlobal('alert', vi.fn());

        TestBed.configureTestingModule({
            providers: [
                NotificationPushService,
                { provide: Messaging, useValue: mockMessaging },
                { provide: AuthService, useValue: mockAuthService },
                { provide: PLATFORM_ID, useValue: 'browser' },
            ],
        });

        service = TestBed.inject(NotificationPushService);
    });

    it('devrait être créé', () => {
        expect(service).toBeTruthy();
    });

    describe('registerAndGetToken', () => {
        it('devrait retourner null si le code ne s exécute pas dans le navigateur (SSR)', async () => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                providers: [
                    NotificationPushService,
                    { provide: Messaging, useValue: mockMessaging },
                    { provide: AuthService, useValue: mockAuthService },
                    { provide: PLATFORM_ID, useValue: 'server' },
                ],
            });

            const serverService = TestBed.inject(NotificationPushService);
            const token = await serverService.registerAndGetToken();

            expect(token).toBeNull();
            expect(navigator.serviceWorker.register).not.toHaveBeenCalled();
            expect(getToken).not.toHaveBeenCalled();
        });

        it('devrait enregistrer le Service Worker, obtenir le token FCM et envoyer le token à l API', async () => {
            const mockToken = 'fcm-token-sample-123';
            vi.mocked(getToken).mockResolvedValue(mockToken);

            const token = await service.registerAndGetToken();

            expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/firebase-messaging-sw.js');
            expect(getToken).toHaveBeenCalledWith(mockMessaging, {
                vapidKey:
                    'BABz3sjgsFLZmHK6F1HZ3gktG-48JXPJPmDLn1yvKJMIJTa_WGzDVb-xvxQN_7a9qo06jM7YE-BKU1P4a7COaZY',
                serviceWorkerRegistration: mockServiceWorkerRegistration,
            });

            expect(mockAuthService.apiService.put).toHaveBeenCalledWith('/notification/token/user', {
                userId: 'user-123',
                token: mockToken,
            });

            expect(token).toBe(mockToken);
        });
    });

    describe('listenForeground', () => {
        it('devrait enregistrer l écouteur onMessage et déclencher l alerte lors de la réception d un payload', () => {
            service.listenForeground();

            expect(onMessage).toHaveBeenCalledWith(mockMessaging, expect.any(Function));

            const callback = vi.mocked(onMessage).mock.calls[0][1] as (payload: any) => void;

            callback({
                notification: {
                    title: 'Titre de test',
                    body: 'Corps du message',
                },
            });

            expect(alert).toHaveBeenCalledWith('Notification reçue : Titre de test - Corps du message');
        });
    });
});
