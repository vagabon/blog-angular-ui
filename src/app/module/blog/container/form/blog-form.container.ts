import { Component, effect, signal } from '@angular/core';
import { form, required, validate } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { DsvButtonComponent } from '@ng-vagabond-lab/ng-dsv/ds/button';
import { DsvCardComponent, DsvCardHeaderComponent } from '@ng-vagabond-lab/ng-dsv/ds/card';
import { FileUploadContainer } from '@ng-vagabond-lab/ng-dsv/ds/file';
import {
    DsvFormSignalCheckboxComponent,
    DsvFormSignalComponent,
    DsvFormSignalInputComponent,
    requiredTrim,
} from '@ng-vagabond-lab/ng-dsv/ds/form/signal';
import { BlogDto } from '../../dto/blog.dto';
import { BlogContainer } from '../blog.container';

@Component({
    selector: 'app-blog-form',
    imports: [
        DsvCardComponent,
        DsvFormSignalComponent,
        DsvFormSignalInputComponent,
        DsvCardHeaderComponent,
        DsvButtonComponent,
        RouterLink,
        DsvFormSignalCheckboxComponent,
        FileUploadContainer,
    ],
    templateUrl: './blog-form.container.html',
    styleUrl: './blog-form.container.scss',
})
export class BlogFormContainer extends BlogContainer {
    readonly blogForm = form(signal<BlogDto>(this.blog()!), (path) => {
        required(path.title);
        required(path.resume);
        required(path.description);
        validate(path.title, requiredTrim);
        validate(path.resume, requiredTrim);
        validate(path.description, requiredTrim);
    });

    constructor() {
        super();
        effect(() => {
            if (this.blog()) {
                this.blogForm().reset(this.blog());
            } else {
                this.blogForm().reset({
                    title: '',
                    image: '',
                    tags: '',
                    resume: '',
                    description: '',
                    user: this.authService.userConnected()!,
                } as BlogDto);
            }
        });
    }

    doSubmit() {
        if (this.blogForm().valid()) {
            this.blogService.createOrUpdate(this.blogForm().value(), (data: BlogDto) => {
                this.routerService.router.navigate(['blog', data.id]);
                document.getElementById('main-scroll')?.scrollTo(0, 0);
            });
        }
    }
}
