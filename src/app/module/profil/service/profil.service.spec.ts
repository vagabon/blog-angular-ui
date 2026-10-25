import { TestBed } from '@angular/core/testing';
import { RouterService } from '@ng-vagabond-lab/ng-dsv/router';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfilDto } from '../dto/profil.dto';
import { ProfilService } from './profil.service';

describe('ProfilService', () => {
    let service: ProfilService;
    let mockApiService: {
        get: ReturnType<typeof vi.fn>;
        post: ReturnType<typeof vi.fn>;
    };
    let mockRouterService: Partial<RouterService>;

    beforeEach(() => {
        mockApiService = {
            get: vi.fn(),
            post: vi.fn(),
        };

        mockRouterService = {};

        TestBed.configureTestingModule({
            providers: [
                ProfilService,
                provideTranslateService(),
                { provide: RouterService, useValue: mockRouterService },
            ],
        });

        service = TestBed.inject(ProfilService);

        (service as any).apiService = mockApiService;
    });

    it('devrait être créé et initialiser le signal profil à null', () => {
        expect(service).toBeTruthy();
        expect(service.profil()).toBeNull();
    });

    describe('getProfilCounts', () => {
        it('devrait appeler apiService.get avec le paramètre userId et mettre à jour le signal profil', () => {
            const mockProfilData: Partial<ProfilDto> = { id: 1, name: 'John Doe' } as any;

            mockApiService.get.mockImplementation((url: string, callback: (data: any) => void) => {
                callback(mockProfilData);
            });

            service.getProfilCounts(42);

            expect(mockApiService.get).toHaveBeenCalledWith(
                '/todolists/lists/count?userId=42',
                expect.any(Function),
            );

            expect(service.profil()).toEqual(mockProfilData);
        });

        it('devrait fusionner les nouvelles données avec le profil existant dans le signal', () => {
            const initialProfil = { id: 1, name: 'John', count: 5 } as unknown as ProfilDto;
            service.profil.set(initialProfil);

            const updatedCountData = { count: 10 };

            mockApiService.get.mockImplementation((url: string, callback: (data: any) => void) => {
                callback(updatedCountData);
            });

            service.getProfilCounts(1);

            expect(service.profil()).toEqual({
                id: 1,
                name: 'John',
                count: 10,
            });
        });

        it('devrait passer undefined dans l URL si userId n est pas fourni', () => {
            service.getProfilCounts();

            expect(mockApiService.get).toHaveBeenCalledWith(
                '/todolists/lists/count?userId=undefined',
                expect.any(Function),
            );
        });
    });

    describe('sendNotification', () => {
        it('devrait appeler apiService.post sur l endpoint /notification/send', () => {
            service.sendNotification();

            expect(mockApiService.post).toHaveBeenCalledWith('/notifications/send', {});
        });
    });

    describe('sendEmail', () => {
        it('devrait appeler apiService.post sur l endpoint /email/produce', () => {
            service.sendEmail();

            expect(mockApiService.post).toHaveBeenCalledWith('/emails/produce', {});
        });
    });
});
