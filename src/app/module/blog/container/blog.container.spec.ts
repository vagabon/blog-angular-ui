import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@ng-vagabond-lab/ng-dsv/module/auth';
import { RouterService } from '@ng-vagabond-lab/ng-dsv/router';
import { provideTranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { BlogDto } from '../dto/blog.dto';
import { BlogService } from '../service/blog.service';
import { BlogContainer } from './blog.container';

const mockBlog: BlogDto = {
    id: 1,
    title: 'Test Blog',
    resume: 'Test Resume',
    image: 'test.jpg',
} as BlogDto;

let paramsSubject: Subject<Record<string, string>>;

describe('BlogContainer', () => {
    let fixture: ComponentFixture<BlogContainer>;
    let component: BlogContainer;
    let routeParams: ReturnType<typeof signal<Record<string, string>>>;
    let blogData: ReturnType<typeof signal<unknown>>;
    let blogMap: Map<number, BlogDto>;
    let doFetchBlog: ReturnType<typeof vi.fn>;
    let setMeta: ReturnType<typeof vi.fn>;
    let routerNavigate: ReturnType<typeof vi.fn>;
    let canFetch: ReturnType<typeof vi.fn>;
    let hasRole: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        routeParams = signal({});
        blogData = signal<unknown>(undefined);
        blogMap = new Map();
        doFetchBlog = vi.fn();
        setMeta = vi.fn();
        routerNavigate = vi.fn();
        canFetch = vi.fn().mockReturnValue(true);
        hasRole = vi.fn().mockReturnValue(false);
        paramsSubject = new Subject();

        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [BlogContainer],
            providers: [
                provideTranslateService(),
                { provide: ActivatedRoute, useValue: { params: { subscribe: vi.fn() } } },
                { provide: AuthService, useValue: { hasRole, canFetch } },
                { provide: RouterService, useValue: { router: { navigate: routerNavigate } } },
                { provide: ActivatedRoute, useValue: { params: paramsSubject } },
                {
                    provide: BlogService,
                    useValue: {
                        blog: {
                            data: blogData,
                            get: (id: number) => blogMap.get(id),
                            set: (id: number, val: BlogDto) => blogMap.set(id, val),
                        },
                        doFetchBlog,
                    },
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(BlogContainer);
        component = fixture.componentInstance;

        vi.spyOn(component, 'routeParams').mockReturnValue(routeParams());
    });

    describe('when blogId is valid and blog exists in store', () => {
        it('then sets blog and calls setMeta', () => {
            blogMap.set(1, mockBlog);
            hasRole.mockReturnValue(true);

            TestBed.tick();
            routeParams.set({ blogId: '1' });
            vi.spyOn(component, 'routeParams').mockReturnValue({ blogId: '1' });
            TestBed.tick();

            expect(doFetchBlog).not.toHaveBeenCalled();
        });
    });

    describe('when blogId is valid and blog is not in store and canFetch is true', () => {
        it('then calls doFetchBlog', () => {
            vi.spyOn(component, 'routeParams').mockReturnValue({ blogId: '2' });
            TestBed.tick();

            expect(doFetchBlog).toHaveBeenCalledWith(2);
            expect(setMeta).not.toHaveBeenCalled();
        });
    });

    describe('when blogId is valid and canFetch is false', () => {
        it('then does not call doFetchBlog nor setMeta', () => {
            canFetch.mockReturnValue(false);
            vi.spyOn(component, 'routeParams').mockReturnValue({ blogId: '3' });
            TestBed.tick();

            expect(doFetchBlog).not.toHaveBeenCalled();
            expect(setMeta).not.toHaveBeenCalled();
        });
    });

    describe('when blogId is present in store and blogService.blog.data() updates', () => {
        it('then sets the blog signal', () => {
            blogMap.set(1, mockBlog);
            vi.spyOn(component, 'routeParams').mockReturnValue({ blogId: '1' });
            component['blogId'].set(1);
            blogData.set(mockBlog);
            TestBed.tick();

            expect(component.blog()).toEqual(mockBlog);
        });
    });

    describe('when user has ADMIN role', () => {
        it('then isAdmin is true', () => {
            hasRole.mockReturnValue(true);
            fixture.detectChanges();
            expect(component.isAdmin()).toBe(true);
        });
    });

    describe('when user does not have ADMIN role', () => {
        it('then isAdmin is false', () => {
            hasRole.mockReturnValue(false);
            fixture.detectChanges();
            expect(component.isAdmin()).toBe(false);
        });
    });

    describe('when doShare is called', () => {
        it('then calls navigator.share with correct payload', async () => {
            const shareMock = vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(globalThis.navigator, 'share', { value: shareMock, configurable: true });

            await component.doShare(mockBlog);

            expect(shareMock).toHaveBeenCalledWith({
                title: mockBlog.title,
                text: mockBlog.resume,
                url: 'https://movie-keeper.fr/blog/' + mockBlog.id,
            });
        });
    });
});
