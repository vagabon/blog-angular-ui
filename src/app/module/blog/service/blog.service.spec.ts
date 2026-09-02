import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { BlogDto } from '../dto/blog.dto';
import { BlogService } from './blog.service';
import { BlogListService } from './list/blog-list.service';

const mockBlog: BlogDto = {
    id: 1,
    title: 'Test',
    resume: 'Resume',
    description: 'Description',
    image: 'img.jpg',
} as BlogDto;

const mockApiService = {
    get: vi.fn(),
    createOrUpdate: vi.fn(),
};

const mockBaseFetchService = {
    getDataFromState: vi.fn().mockReturnValue(null),
    setDataToState: vi.fn(),
};

const mockBlogListService = {
    fetchByPage: vi.fn(),
    search: vi.fn().mockReturnValue({}),
};

describe('BlogService', () => {
    let service: BlogService;

    beforeEach(() => {
        vi.clearAllMocks();

        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [
                BlogService,
                provideTranslateService(),
                { provide: BlogListService, useValue: mockBlogListService },
            ],
        });

        service = TestBed.inject(BlogService);
        Object.assign(service, mockBaseFetchService);
        Object.defineProperty(service, 'apiService', {
            value: mockApiService,
            configurable: true,
        });
    });

    describe('when doFetchBlog is called and data exists in transfer state', () => {
        it('then initializes blog from state without calling apiService', () => {
            mockBaseFetchService.getDataFromState.mockReturnValue(mockBlog);
            service.doFetchBlog(1);

            expect(service.blog.get(1)).toEqual(mockBlog);
            expect(mockApiService.get).not.toHaveBeenCalled();
        });
    });

    describe('when doFetchBlog is called and data is not in transfer state', () => {
        it('then calls apiService.get and initializes blog on callback', () => {
            mockApiService.get.mockImplementation((_url: string, cb: (d: BlogDto) => void) => cb(mockBlog));
            service.doFetchBlog(1);

            expect(mockApiService.get).toHaveBeenCalledWith('/blog/1', expect.any(Function));
            expect(mockBaseFetchService.setDataToState).toHaveBeenCalledWith('/blog/1', mockBlog);
            expect(service.blog.get(1)).toEqual(mockBlog);
        });
    });

    describe('when createOrUpdate is called for a new blog', () => {
        it('then toast contains "créer", updates store, calls fetchByPage and callback', () => {
            const newBlog = { ...mockBlog, id: 0 };
            const callback = vi.fn();
            mockApiService.createOrUpdate.mockImplementation(
                (_e: string, _n: BlogDto, cb: (d: BlogDto) => void) => cb(mockBlog),
            );

            service.createOrUpdate(newBlog, callback);

            expect(mockApiService.createOrUpdate).toHaveBeenCalledWith(
                'blog',
                newBlog,
                expect.any(Function),
                expect.stringContaining('créer'),
            );
            expect(service.blog.get(mockBlog.id)).toEqual(mockBlog);
            expect(mockBlogListService.fetchByPage).toHaveBeenCalledWith(mockBlogListService.search(), 1);
            expect(callback).toHaveBeenCalledWith(mockBlog);
        });
    });

    describe('when createOrUpdate is called for an existing blog without callback', () => {
        it('then toast contains "mise a jour" and does not throw', () => {
            mockApiService.createOrUpdate.mockImplementation(
                (_e: string, _n: BlogDto, cb: (d: BlogDto) => void) => cb(mockBlog),
            );

            service.createOrUpdate(mockBlog);

            expect(mockApiService.createOrUpdate).toHaveBeenCalledWith(
                'blog',
                mockBlog,
                expect.any(Function),
                expect.stringContaining('mise a jour'),
            );
            expect(mockBlogListService.fetchByPage).toHaveBeenCalled();
        });
    });
});
