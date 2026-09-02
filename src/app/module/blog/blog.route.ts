import { Routes } from '@angular/router';
import { authGuard } from '@ng-vagabond-lab/ng-dsv/module/auth';

export const BlogRoute: Routes = [
    {
        path: '',
        loadComponent: () => import('./container/list/blog-list.container').then((m) => m.BlogListContainer),
    },
    {
        path: 'create',
        loadComponent: () => import('./container/form/blog-form.container').then((m) => m.BlogFormContainer),
        canActivate: [authGuard('ADMIN')],
    },
    {
        path: 'update/:blogId',
        loadComponent: () => import('./container/form/blog-form.container').then((m) => m.BlogFormContainer),
        canActivate: [authGuard('ADMIN')],
    },
    {
        path: ':blogId',
        loadComponent: () => import('./container/blog.container').then((m) => m.BlogContainer),
    },
];
