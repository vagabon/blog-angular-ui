import { Routes } from '@angular/router';

export const TodolistRoute: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./container/list/todolist-list.container').then((m) => m.TodolistListContainer),
    },
    {
        path: ':todolistId',
        loadComponent: () => import('./container/todolist.container').then((m) => m.TodolistContainer),
    },
    {
        path: 'item/:todolistId',
        loadComponent: () => import('./container/todolist.container').then((m) => m.TodolistContainer),
    },
];
