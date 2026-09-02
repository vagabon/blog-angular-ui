import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DateFormatPipe } from '@ng-vagabond-lab/ng-dsv/date';
import { DsvButtonComponent } from '@ng-vagabond-lab/ng-dsv/ds/button';
import { DsvCardComponent, DsvCardHeaderComponent } from '@ng-vagabond-lab/ng-dsv/ds/card';
import { DsvFileShowComponent } from '@ng-vagabond-lab/ng-dsv/ds/file';
import { DsvMarkdownContainer } from '@ng-vagabond-lab/ng-dsv/ds/markdown';
import { BlogDto } from '../../dto/blog.dto';

@Component({
    selector: 'app-blog-card',
    imports: [
        DsvCardComponent,
        DateFormatPipe,
        DsvMarkdownContainer,
        DsvCardHeaderComponent,
        DsvButtonComponent,
        RouterLink,
        DsvFileShowComponent,
    ],
    templateUrl: './blog-card.component.html',
    styleUrl: './blog-card.component.scss',
})
export class BlogCardComponent {
    readonly blog = input<BlogDto>();
}
