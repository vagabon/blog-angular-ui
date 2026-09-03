import { Routes } from '@angular/router';
import { authGuard } from '@ng-vagabond-lab/ng-dsv/module/auth';
import { ContactComponent } from '@ng-vagabond-lab/ng-dsv/module/contact';
import { AccessDeniedComponent, NotFoundComponent } from '@ng-vagabond-lab/ng-dsv/template';

export const routes: Routes = [
    { path: '', loadChildren: () => import('./module/home/home.route').then((m) => m.HomeRoute) },
    { path: 'home', redirectTo: '/', pathMatch: 'full' },
    // {
    //     path: 'mentions-legales',
    //     loadComponent: () =>
    //         import('./module/common/mentions-legales/component/mentions-legales.component').then(
    //             (m) => m.MentionsLegalesComponent,
    //         ),
    // },
    {
        path: 'news',
        loadChildren: () => import('@ng-vagabond-lab/ng-dsv/module/news').then((m) => m.NewsRoute),
    },
    {
        path: 'blog',
        loadChildren: () => import('./module/blog/blog.route').then((m) => m.BlogRoute),
    },
    {
        path: 'notification',
        loadChildren: () =>
            import('@ng-vagabond-lab/ng-dsv/module/notification').then((m) => m.NotificationRoute),
        canActivate: [authGuard('USER')],
    },
    {
        path: 'profil',
        loadChildren: () => import('./module/profil/profil.route').then((m) => m.ProfilRoute),
        canActivate: [authGuard('USER')],
    },
    {
        path: 'admin',
        loadChildren: () => import('./module/admin/admin.route').then((m) => m.MemeRoute),
        canActivate: [authGuard('ADMIN')],
    },
    {
        path: 'contact',
        component: ContactComponent,
        data: { contactEmail: 'contact@movie-keeper.fr' },
    },
    {
        path: 'access-denied',
        component: AccessDeniedComponent,
        data: { contactEmail: 'gonzague.clement@gmail.com' },
    },
    {
        path: 'robots.txt',
        redirectTo: '',
    },
    {
        path: '**',
        component: NotFoundComponent,
        data: { contactEmail: 'gonzague.clement@gmail.com' },
    },
];
