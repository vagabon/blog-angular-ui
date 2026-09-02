import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { BlogListContainer } from './blog-list.container';

describe('BlogListContainer', () => {
    let component: BlogListContainer;
    let fixture: ComponentFixture<BlogListContainer>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlogListContainer],
            providers: [provideTranslateService()],
        }).compileComponents();

        fixture = TestBed.createComponent(BlogListContainer);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
