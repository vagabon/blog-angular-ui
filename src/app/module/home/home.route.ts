import { Routes } from '@angular/router';

export const HomeRoute: Routes = [
    {
        path: '',
        loadComponent: () => import('./container/home.container').then((m) => m.HomeContainer),
    },
];
