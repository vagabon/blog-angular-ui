import { Component, effect, inject } from '@angular/core';
import { BaseScrollComponent } from '@ng-vagabond-lab/ng-dsv/base';
import { AppConf } from 'app/conf/AppConf';
import { NewsService } from '../../service/news.service';

@Component({
  selector: 'app-news.list',
  imports: [],
  templateUrl: './news.list.component.html',
  styleUrl: './news.list.component.scss'
})
export class NewsListComponent extends BaseScrollComponent {
  readonly newsService = inject(NewsService);

  constructor() {
    super();
    this.setMeta(AppConf.TITLE, AppConf.META.NEWS.LIST, AppConf.META.NEWS.LIST_DESCRIPTION);
    effect(() => {
      if (
        this.newsService.news.data().length === 0 &&
        this.newsService.apiService.platformService.isPlatformBrowser()
      ) {
        this.newsService.fetchNews('news');
      }
      console.log(this.newsService.news.data());
    });
  }

  override doLoad(): void {
    throw new Error('Method not implemented.');
  }
}
