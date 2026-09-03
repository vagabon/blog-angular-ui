import { TestBed } from '@angular/core/testing';
import { PageableDto } from '@ng-vagabond-lab/ng-dsv/api';
import { NewsDto } from '@ng-vagabond-lab/ng-dsv/module/news';
import { provideTranslateService } from '@ngx-translate/core';
import { BlogDto } from 'app/module/blog/dto/blog.dto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HomeService } from './home.service';

describe('HomeService', () => {
    let service: HomeService;
    let mockApiService: {
        findById: ReturnType<typeof vi.fn>;
        findBy: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        mockApiService = {
            findById: vi.fn(),
            findBy: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [HomeService, provideTranslateService()],
        });

        service = TestBed.inject(HomeService);

        // Injection du mock apiService hérité de BaseApiService
        (service as any).apiService = mockApiService;
    });

    it('devrait être créé et initialiser les signals par défaut', () => {
        expect(service).toBeTruthy();
        expect(service.news()).toBeUndefined();
        expect(service.lastNews()).toEqual([]);
        expect(service.lastBlog()).toEqual([]);
    });

    describe('getNews', () => {
        it('devrait appeler apiService.findById et mettre à jour le signal news quand il est undefined', () => {
            const mockNewsData = { id: 1, title: 'Nouvelle importante' } as NewsDto;

            mockApiService.findById.mockImplementation(
                (entity: string, id: string, callback: (data: any) => void) => {
                    callback(mockNewsData);
                },
            );

            service.getNews();

            expect(mockApiService.findById).toHaveBeenCalledWith('news', '1', expect.any(Function));
            expect(service.news()).toEqual(mockNewsData);
        });

        it('ne devrait PAS appeler apiService.findById si le signal news a déjà une valeur', () => {
            const existingNews = { id: 1, title: 'News existante' } as NewsDto;
            service.news.set(existingNews);

            service.getNews();

            expect(mockApiService.findById).not.toHaveBeenCalled();
        });
    });

    describe('getLastNews', () => {
        it('devrait appeler apiService.findBy et mettre à jour lastNews quand la liste est vide', () => {
            const mockNewsList: NewsDto[] = [{ id: 1, title: 'News 1' } as NewsDto];
            const mockPageableResponse: PageableDto<NewsDto[]> = {
                content: mockNewsList,
            } as any;

            mockApiService.findBy.mockImplementation(
                (
                    url: string,
                    query: string,
                    params: string,
                    page: number,
                    size: number,
                    options: any,
                    callback: (data: any) => void,
                ) => {
                    callback(mockPageableResponse);
                },
            );

            service.getLastNews();

            expect(mockApiService.findBy).toHaveBeenCalledWith(
                '/news/findBy',
                '(title%And|Description%)AndActive',
                ',,true',
                0,
                3,
                {
                    order: 'creationDate',
                    orderAsc: false,
                },
                expect.any(Function),
            );

            expect(service.lastNews()).toEqual(mockNewsList);
        });

        it('ne devrait PAS appeler apiService.findBy si lastNews contient déjà des éléments', () => {
            service.lastNews.set([{ id: 1, title: 'News déjà présente' } as NewsDto]);

            service.getLastNews();

            expect(mockApiService.findBy).not.toHaveBeenCalled();
        });
    });

    describe('getLastBlog', () => {
        it('devrait appeler apiService.findBy et mettre à jour lastBlog quand la liste est vide', () => {
            const mockBlogList: BlogDto[] = [{ id: 1, title: 'Blog 1' } as BlogDto];
            const mockPageableResponse: PageableDto<BlogDto[]> = {
                content: mockBlogList,
            } as any;

            mockApiService.findBy.mockImplementation(
                (
                    url: string,
                    query: string,
                    params: string,
                    page: number,
                    size: number,
                    options: any,
                    callback: (data: any) => void,
                ) => {
                    callback(mockPageableResponse);
                },
            );

            service.getLastBlog();

            expect(mockApiService.findBy).toHaveBeenCalledWith(
                '/blog/findBy',
                '(title%And|Description%)AndActive',
                ',,true',
                0,
                3,
                {
                    order: 'creationDate',
                    orderAsc: false,
                },
                expect.any(Function),
            );

            expect(service.lastBlog()).toEqual(mockBlogList);
        });

        it('ne devrait PAS appeler apiService.findBy si lastBlog contient déjà des éléments', () => {
            service.lastBlog.set([{ id: 1, title: 'Article de blog existant' } as BlogDto]);

            service.getLastBlog();

            expect(mockApiService.findBy).not.toHaveBeenCalled();
        });
    });
});
