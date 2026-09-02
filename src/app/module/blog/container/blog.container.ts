import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BaseRouteContainer } from '@ng-vagabond-lab/ng-dsv/base';
import { DsvButtonComponent } from '@ng-vagabond-lab/ng-dsv/ds/button';
import { AuthService } from '@ng-vagabond-lab/ng-dsv/module/auth';
import { BlogCardComponent } from '../component/card/blog-card.component';
import { BlogDto } from '../dto/blog.dto';
import { BlogService } from '../service/blog.service';

@Component({
    selector: 'app-blog',
    imports: [BlogCardComponent, DsvButtonComponent, RouterLink],
    templateUrl: './blog.container.html',
    styleUrl: './blog.container.scss',
})
export class BlogContainer extends BaseRouteContainer {
    readonly auhService = inject(AuthService);
    readonly blogService = inject(BlogService);

    readonly blogId = signal<number>(0);
    readonly blog = signal<BlogDto | undefined>(undefined);

    readonly isAdmin = computed<boolean>(() => this.auhService.hasRole('ADMIN'));

    constructor() {
        super();
        effect(() => {
            const blogId = Number(this.routeParams()?.['blogId']);
            if (Number.isInteger(blogId)) {
                this.blogId?.set(blogId);
                if (this.blogService.blog.get(blogId)) {
                    const blog = this.blogService.blog.get(blogId);
                    this.seoService.setMeta(blog?.title!, blog?.resume!, blog?.image);
                } else if (this.authService.canFetch()) {
                    this.blogService.doFetchBlog(blogId);
                }
            }
        });
        effect(() => {
            if (this.blogId() && this.blogService.blog.data()) {
                this.blog.set(this.blogService.blog.get(this.blogId()));
            }
        });
    }

    async doShare(blog: BlogDto): Promise<void> {
        await globalThis.navigator.share({
            title: blog.title,
            text: blog.resume,
            url: 'https://movie-keeper.fr/blog/' + blog.id,
        });
    }
}
