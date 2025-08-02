import { Routes } from '@angular/router';

export const MemeRoute: Routes = [
    { path: '', redirectTo: '/admin/user', pathMatch: 'full' },
    {
        path: ':type',
        loadComponent: () =>
            import('@ng-vagabond-lab/ng-dsv/modules/admin').then(
                (m) => m.AdminSearchContainer
            ),
    },
    {
        path: ':type/:id',
        loadComponent: () =>
            import('@ng-vagabond-lab/ng-dsv/modules/admin').then(
                (m) => m.AdminFormContainer
            ),
    },
];
