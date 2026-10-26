import { inject } from '@angular/core';
import { EnvironmentService } from '@ng-vagabond-lab/ng-dsv/environment';
import { I18nService } from '@ng-vagabond-lab/ng-dsv/i18n';
import { AdminService } from '@ng-vagabond-lab/ng-dsv/module/admin';
import { AdminConf } from './conf/admin.conf';

import AUTH_FR from './locale/fr/auth.json';
import FR from './locale/fr/fr.json';
import MENU_FR from './locale/fr/menu.json';

import { ApiService } from '@ng-vagabond-lab/ng-dsv/api';
import { RouterService } from '@ng-vagabond-lab/ng-dsv/router';
import AUTH_EN from './locale/en/auth.json';
import EN from './locale/en/en.json';
import MENU_EN from './locale/en/menu.json';

export const initializeApp_ = () => {
    const apiService = inject(ApiService);
    const routerService = inject(RouterService);

    const adminService = inject(AdminService);
    adminService.tabs.set(AdminConf);

    const i18nService = inject(I18nService);
    i18nService.initLanguage(
        {
            AUTH: AUTH_FR,
            MENU: MENU_FR,
            ...FR,
        },
        {
            AUTH: AUTH_EN,
            MENU: MENU_EN,
            ...EN,
        },
    );

    const environmentService = inject(EnvironmentService);

    return environmentService.loadEnv().then((config) => {
        apiService.baseUrl.set(config.API_URL + '/blog/v2');
        apiService.baseGwUrl.set(config.API_URL + '/v1');

        routerService.initAnalytics(config?.ANALYTICS_ID);
    });
};
