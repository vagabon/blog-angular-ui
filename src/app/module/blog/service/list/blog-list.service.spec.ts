import { TestBed } from '@angular/core/testing';

import { signal } from '@angular/core';
import { ApiService } from '@ng-vagabond-lab/ng-dsv/api';
import { AuthService } from '@ng-vagabond-lab/ng-dsv/module/auth';
import { provideTranslateService } from '@ngx-translate/core';
import { BlogListService } from './blog-list.service';

const mockApiService = {
    post: vi.fn(),
};

const mockAuthService = {
    isAdmin: signal(true),
    userConnected: signal({}),
};

describe('BlogService', () => {
    let service: BlogListService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideTranslateService(),
                BlogListService,
                { provide: ApiService, useValue: mockApiService },
                { provide: AuthService, useValue: mockAuthService },
            ],
        });
        service = TestBed.inject(BlogListService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when getParams and admin then get all fields & values', () => {
        service.search.set('Test');
        const result = service.getParams();
        expect(result).toBe(
            '&fields=(title%25And%7CDescription%25)%3E%3EcreationDateDesc&values=Test,Test&first=0&max=20',
        );
    });
});
