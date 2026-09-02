import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DateFormatPipe } from '@ng-vagabond-lab/ng-dsv/date';
import { DsvCardComponent } from '@ng-vagabond-lab/ng-dsv/ds/card';
import { DsvFileShowComponent } from '@ng-vagabond-lab/ng-dsv/ds/file';
import { DsvMarkdownContainer } from '@ng-vagabond-lab/ng-dsv/ds/markdown';
import { RouterInternalPipe } from '@ng-vagabond-lab/ng-dsv/router';
import { BlogDto } from '../../../dto/blog.dto';

@Component({
    selector: 'app-blog-card-resume',
    imports: [
        DsvCardComponent,
        DateFormatPipe,
        RouterInternalPipe,
        DsvMarkdownContainer,
        RouterLink,
        DsvFileShowComponent,
    ],
    templateUrl: './blog-card-resume.component.html',
    styleUrls: ['../blog-card.component.scss', './blog-card-resume.component.scss'],
})
export class BlogCardResumeComponent {
    readonly blog = input<BlogDto>();
}
