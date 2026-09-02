import { inject, Injectable } from '@angular/core';
import { ID } from '@ng-vagabond-lab/ng-dsv/api';
import { BaseFetchService } from '@ng-vagabond-lab/ng-dsv/base/service';
import { StoreMap } from '@ng-vagabond-lab/ng-dsv/storage';
import { BlogDto } from '../dto/blog.dto';
import { BlogListService } from './list/blog-list.service';

@Injectable({
    providedIn: 'root',
})
export class BlogService extends BaseFetchService<BlogDto> {
    readonly blogListService = inject(BlogListService);
    readonly blog = new StoreMap<ID, BlogDto>();

    doFetchBlog(blogId: number): void {
        const url = '/blog/' + blogId;
        const data = this.getDataFromState(url);
        if (data) {
            this.initBlog(blogId, data);
            return;
        }
        this.apiService.get<BlogDto>(url, (data) => {
            this.setDataToState(url, data);
            this.initBlog(blogId, data);
        });
    }

    initBlog(blogId: ID, data: BlogDto) {
        this.blog.set(blogId, data);
    }

    createOrUpdate(blog: BlogDto, callback?: (data: BlogDto) => void) {
        const toast = "La blog '" + blog.title + "' a bien été " + (blog.id ? 'mise a jour' : 'créer') + '.';
        this.apiService.createOrUpdate<BlogDto>(
            'blog',
            blog,
            (data) => {
                this.blog.set(data.id, data);
                this.blogListService.fetchByPage(this.blogListService.search(), 1);
                callback?.(data);
            },
            toast,
        );
    }
}
