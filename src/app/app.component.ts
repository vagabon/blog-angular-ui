import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseMainContainer } from '@ng-vagabond-lab/ng-dsv/base';
import { DsvContainerComponent } from '@ng-vagabond-lab/ng-dsv/ds/container';
import { DsvHeaderComponent } from '@ng-vagabond-lab/ng-dsv/ds/header';
import { LinearProgressComponent } from '@ng-vagabond-lab/ng-dsv/ds/linear-progress';
import { MenuService } from '@ng-vagabond-lab/ng-dsv/ds/menu';
import { DsvScrollInfiniteContainer } from '@ng-vagabond-lab/ng-dsv/ds/scroll';
import { DsvThemeComponent } from '@ng-vagabond-lab/ng-dsv/ds/theme';
import { DsvToastComponent } from '@ng-vagabond-lab/ng-dsv/ds/toast';
import { AuthComponent } from '@ng-vagabond-lab/ng-dsv/module/auth';
import {
    NotificationButtonContainer,
    NotificationService,
} from '@ng-vagabond-lab/ng-dsv/module/notification';
import { PlatformSwipeDirective } from '@ng-vagabond-lab/ng-dsv/platform';
import { FooterComponent, MenuContainer, MenuDto } from '@ng-vagabond-lab/ng-dsv/template';
import { menu } from './conf/menu.conf';
import { NotificationPushService } from './module/notification/service/notification-push.service';

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
        PlatformSwipeDirective,
    ],
    templateUrl: './app.component.html',
})
export class AppComponent extends BaseMainContainer {
    readonly menuService = inject(MenuService);
    readonly notificationService = inject(NotificationService);
    readonly notificationPushService = inject(NotificationPushService);

    readonly menu = signal<MenuDto>(menu);

    constructor() {
        super();
        effect(async () => {
            if (this.authService.userConnected()) {
                await this.notificationPushService.registerAndGetToken();
            } else if (this.authService.isRefreshTokenLoaded()) {
                if (
                    this.routerService.currentUrl().includes('/admin') ||
                    this.routerService.currentUrl().includes('/profil')
                ) {
                    this.routerService.navigate(['/']);
                } else if (this.routerService.currentUrl().includes('/todolist/')) {
                    this.routerService.navigate(['/todolist']);
                }
            }
        });

        effect(() => {
            if (this.authService.userConnected() && this.routerService.currentUrl()) {
                this.notificationService.fetchNbRead(this.routerService.currentUrl());
            }
        });
    }
}
