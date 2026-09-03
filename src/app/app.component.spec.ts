import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuService } from '@ng-vagabond-lab/ng-dsv/ds/menu';
import { EnvironmentService } from '@ng-vagabond-lab/ng-dsv/environment';
import { AuthService } from '@ng-vagabond-lab/ng-dsv/module/auth';
import { RouterService } from '@ng-vagabond-lab/ng-dsv/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { NotificationPushService } from './module/notification/service/notification-push.service';

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;
    let envServiceMock: Partial<EnvironmentService>;
    let mockMenuService: {
        isMenuOpen: () => boolean;
        toogleMenu: () => void;
    };

    beforeEach(async () => {
        mockMenuService = {
            isMenuOpen: vi.fn(),
            toogleMenu: vi.fn(),
        };

        (window as any).google = {
            accounts: { id: { prompt: () => {}, initialize: () => {}, renderButton: () => {} } },
        };

        envServiceMock = {
            config: signal({
                APP_NAME: 'Blog & Tools',
                GOOGLE_CLIENT_ID: 'GOOGLE_CLIENT_ID',
                ANALYTICS_ID: '',
                CONTACT: 'CONTACT',
                COPIYRIGHT: 'COPIYRIGHT',
                PROD: true,
            }),
        };

        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                provideTranslateService(),
                { provide: EnvironmentService, useValue: envServiceMock },
                {
                    provide: NotificationPushService,
                    useValue: {
                        registerAndGetToken: vi.fn(),
                    },
                },
                { provide: MenuService, useValue: mockMenuService },
                {
                    provide: AuthService,
                    useValue: {
                        userConnected: signal({ id: 1, pseudo: 'pseudo', email: 'email', roles: [] }),
                        isPlatformBrowser: signal(true),
                        isRefreshTokenLoaded: signal(true),
                        refreshToken: vi.fn(),
                        hasRole: vi.fn(),
                        apiService: {
                            nbLoaded: signal(0),
                        },
                    },
                },
                {
                    provide: RouterService,
                    useValue: {
                        currentUrl: signal(''),
                        isLoading: signal(false),
                        router: {
                            navigate: vi.fn(),
                            events: { subscribe: vi.fn(), pipe: () => of({}) },
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });
});
