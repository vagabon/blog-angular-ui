import { inject, Injectable } from '@angular/core';
import { ApiService, ID, PageableDto } from '@ng-vagabond-lab/ng-dsv/api';
import { ToastService } from '@ng-vagabond-lab/ng-dsv/ds/toast';
import { Store } from 'app/store/store';
import { NewsDto } from '../dto/NewsDto';

@Injectable({ providedIn: 'root' })
export class NewsService {
  readonly apiService = inject(ApiService);
  readonly toastService = inject(ToastService);

  news = new Store<NewsDto>();
  singelNews = new Store<NewsDto>();

  fetchNews(
    endPoint: string,
    filter: NewsDto = {},
    first: number = 0,
    max: number = 10,
    orderField: string = 'id',
    order: string = 'desc',
  ) {
    const champs = '(title%And|Description%)AndActive';
    const value = filter.search ?? '';
    const values = value + ',' + value + ',true';
    const orderValue = {
      order: orderField,
      orderAsc: order === 'asc',
    };
    this.apiService.findBy<PageableDto<NewsDto[]>>(
      '/' + endPoint + '/findBy',
      champs,
      values,
      first,
      max,
      orderValue,
      this.updateNews(first).bind(this),
    );
  }

  updateNews = (page: number) => (data: PageableDto<NewsDto[]>) => {
    this.news.updateForPage(page, data.content);
  }

  fetchById(endPoint: string, id: ID) {
    this.apiService.findById<NewsDto>('/' + endPoint, id, (data: NewsDto) => {
      this.singelNews.update(Number(id), data);
    });
  }

  createOrUpdate(endPoint: string, data: NewsDto) {
    this.apiService.createOrUpdate<NewsDto>('/' + endPoint + '/', data, () => {
      this.fetchNews(endPoint);
    });
  }
}
