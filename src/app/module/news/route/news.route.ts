import { Routes } from '@angular/router';

export const NewsRoute: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../component/list/news.list.component').then(
        (m) => m.NewsListComponent
      ),
  },
];
