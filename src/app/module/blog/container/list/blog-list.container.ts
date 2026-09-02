import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BaseSearchContainer } from '@ng-vagabond-lab/ng-dsv/base';
import { DsvButtonComponent } from '@ng-vagabond-lab/ng-dsv/ds/button';
import { DsvCardComponent, DsvCardHeaderComponent } from '@ng-vagabond-lab/ng-dsv/ds/card';
import { DsvFormReactiveSearchbarComponent } from '@ng-vagabond-lab/ng-dsv/ds/form/reactive';
import { DsvScrollInfiniteContainer } from '@ng-vagabond-lab/ng-dsv/ds/scroll';
import { AuthService } from '@ng-vagabond-lab/ng-dsv/module/auth';
import { BlogCardResumeComponent } from '../../component/card/resume/blog-card-resume.component';
import { BlogDto } from '../../dto/blog.dto';
import { BlogListService } from '../../service/list/blog-list.service';

@Component({
    selector: 'app-blog-list',
    imports: [
        DsvCardComponent,
        DsvFormReactiveSearchbarComponent,
        DsvScrollInfiniteContainer,
        BlogCardResumeComponent,
        DsvButtonComponent,
        DsvCardHeaderComponent,
        RouterLink,
    ],
    templateUrl: './blog-list.container.html',
    styleUrl: './blog-list.container.scss',
})
export class BlogListContainer extends BaseSearchContainer<BlogListService, BlogDto> {
    readonly auhService = inject(AuthService);

    readonly isAdmin = computed<boolean>(() => this.auhService.hasRole('ADMIN'));

    constructor(public blogListService: BlogListService) {
        super(blogListService);
        this.seoService.setMeta(
            'Les dernières blog',
            'Retrouver les dernières blog sur movie-keeper.fr',
            '/images/logo.png',
        );
    }
}
