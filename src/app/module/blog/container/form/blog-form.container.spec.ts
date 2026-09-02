import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { BlogFormContainer } from './blog-form.container';

describe('BlogFormContainer', () => {
    let component: BlogFormContainer;
    let fixture: ComponentFixture<BlogFormContainer>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlogFormContainer],
            providers: [
                provideTranslateService(),
                {
                    provide: ActivatedRoute,
                    useValue: { params: of({}), snapshot: { params: {} } },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BlogFormContainer);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create', () => {
        component.blogForm().value.update((data) => ({
            ...data,
            title: 'title',
            resume: 'resume',
            description: 'description',
        }));

        component.doSubmit();
        expect(component).toBeTruthy();
    });
});
