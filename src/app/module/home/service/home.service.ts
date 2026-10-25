import { Service, signal } from '@angular/core';
import { PageableDto } from '@ng-vagabond-lab/ng-dsv/api';
import { BaseApiService } from '@ng-vagabond-lab/ng-dsv/base/service';
import { NewsDto } from '@ng-vagabond-lab/ng-dsv/module/news';
import { BlogDto } from 'app/module/blog/dto/blog.dto';

@Service()
export class HomeService extends BaseApiService {
    public readonly news = signal<NewsDto | undefined>(undefined);
    public readonly lastNews = signal<NewsDto[] | undefined>(undefined);
    public readonly lastBlog = signal<BlogDto[] | undefined>(undefined);

    getNews() {
        !this.news() &&
            this.apiService.findById<NewsDto>('/news', '1', (news) => this.news.set(news ?? ({} as NewsDto)));
    }

    getLastNews() {
        !this.lastNews() &&
            this.apiService.findBy<PageableDto<NewsDto[]>>(
                '/news/findBy',
                '(title%And|Description%)AndActive',
                ',,true',
                0,
                3,
                {
                    order: 'creationDate',
                    orderAsc: false,
                },
                (news) => this.lastNews.set(news.content),
            );
    }

    getLastBlog() {
        !this.lastBlog() &&
            this.apiService.findBy<PageableDto<BlogDto[]>>(
                '/blogs/findBy',
                '(title%And|Description%)AndActive',
                ',,true',
                0,
                3,
                {
                    order: 'creationDate',
                    orderAsc: false,
                },
                (blog) => this.lastBlog.set(blog.content),
            );
    }
}
