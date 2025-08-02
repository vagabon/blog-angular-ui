import { Routes } from '@angular/router';
import { authGuard } from '@ng-vagabond-lab/ng-dsv/modules/auth';
import { NotFoundComponent } from './template/not-found/component/not-found.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'admin',
        loadChildren: () =>
            import('./module/admin/admin.route').then((m) => m.MemeRoute),
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: '**', component: NotFoundComponent
    },
];
