import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '@ng-vagabond-lab/ng-dsv/ds/menu';
import { EnvironmentService } from '@ng-vagabond-lab/ng-dsv/environment';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

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
                APP_NAME: 'Movie Keeper TEST',
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
                { provide: MenuService, useValue: mockMenuService },
                {
                    provide: ActivatedRoute,
                    useValue: { params: of({}), snapshot: { params: {} } },
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
