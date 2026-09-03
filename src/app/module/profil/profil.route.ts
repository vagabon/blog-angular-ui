import { Routes } from '@angular/router';

export const ProfilRoute: Routes = [
    {
        path: '',
        loadComponent: () => import('./container/profil.container').then((m) => m.ProfilContainer),
    },
    {
        path: ':profilId',
        loadComponent: () => import('./container/profil.container').then((m) => m.ProfilContainer),
    },
];
