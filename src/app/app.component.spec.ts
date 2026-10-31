import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '@ng-vagabond-lab/ng-dsv/ds/menu';
import { EnvironmentService } from '@ng-vagabond-lab/ng-dsv/environment';
import { AuthService, UserDto } from '@ng-vagabond-lab/ng-dsv/module/auth';
import { RouterService } from '@ng-vagabond-lab/ng-dsv/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { NotificationPushService } from './module/notification/service/notification-push.service';

const userConnected = signal<UserDto | null>({ id: 1, username: 'pseudo', roles: [] });
const currentUrl = signal('/');
const navigate = vi.fn();

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
                API_URL: 'http://api.localhost:8080',
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
                        userConnected,
                        isPlatformBrowser: signal(true),
                        isRefreshTokenLoaded: signal(true),
                        refreshToken: vi.fn(),
                        hasRole: vi.fn(),
                        apiService: {
                            nbLoaded: signal(0),
                            baseUrl: signal(''),
                        },
                    },
                },
                {
                    provide: RouterService,
                    useValue: {
                        currentUrl,
                        isLoading: signal(false),
                        router: {
                            navigate: navigate,
                            events: { subscribe: vi.fn(), pipe: () => of({}) },
                        },
                    },
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({}),
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

    it('should redirect to / when url is /admin and not connected', () => {
        userConnected.set(null);
        currentUrl.set('/admin');

        fixture.detectChanges();

        expect(navigate).toHaveBeenCalledWith(['/']);
    });

    it('should redirect to /todolist when url is /todolist/ and not connected', () => {
        userConnected.set(null);
        currentUrl.set('/todolist/2');

        fixture.detectChanges();

        expect(navigate).toHaveBeenCalledWith(['/todolist']);
    });
});
