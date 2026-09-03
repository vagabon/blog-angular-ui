import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UserDto } from '@ng-vagabond-lab/ng-dsv/module/auth';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfilDto } from '../dto/profil.dto';
import { ProfilService } from '../service/profil.service';
import { ProfilContainer } from './profil.container';

describe('ProfilContainer', () => {
    let component: ProfilContainer;
    let fixture: ComponentFixture<ProfilContainer>;

    // 1. Déclaration du signal profil pour le mock
    const profilSignal = signal<ProfilDto | null>(null);

    let mockProfilService: {
        getProfilCounts: ReturnType<typeof vi.fn>;
        profil: typeof profilSignal;
    };

    const userConnectedSignal = signal<UserDto | null>(null);

    let mockAuthService: {
        userConnected: typeof userConnectedSignal;
        hasRole: ReturnType<typeof vi.fn>;
    };

    beforeEach(async () => {
        userConnectedSignal.set(null);
        profilSignal.set(null); // Réinitialisation du signal profil entre chaque test

        // 2. Ajout de profil dans l'objet mockProfilService
        mockProfilService = {
            getProfilCounts: vi.fn(),
            profil: profilSignal,
        };

        mockAuthService = {
            userConnected: userConnectedSignal,
            hasRole: vi.fn().mockReturnValue(false),
        };

        await TestBed.configureTestingModule({
            imports: [ProfilContainer],
            providers: [
                provideRouter([]),
                provideTranslateService(),
                { provide: ProfilService, useValue: mockProfilService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(ProfilContainer);
        component = fixture.componentInstance;

        (component as any).authService = mockAuthService;
    });

    it('devrait créer le composant', () => {
        expect(component).toBeTruthy();
        expect(component.user()).toBeNull();
    });

    describe('isAdmin', () => {
        it('devrait retourner true si authService.hasRole("ADMIN") renvoie true', () => {
            mockAuthService.hasRole.mockReturnValue(true);

            expect(component.isAdmin()).toBe(true);
            expect(mockAuthService.hasRole).toHaveBeenCalledWith('ADMIN');
        });

        it('devrait retourner false si authService.hasRole("ADMIN") renvoie false', () => {
            mockAuthService.hasRole.mockReturnValue(false);

            expect(component.isAdmin()).toBe(false);
            expect(mockAuthService.hasRole).toHaveBeenCalledWith('ADMIN');
        });
    });

    describe('effect (userConnected)', () => {
        it('devrait mettre à jour user et appeler getProfilCounts quand un utilisateur est connecté', async () => {
            const mockUser: UserDto = {
                id: 'user-123',
                email: 'test@example.com',
            } as unknown as UserDto;

            userConnectedSignal.set(mockUser);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.user()).toEqual(mockUser);
            expect(mockProfilService.getProfilCounts).toHaveBeenCalledWith('user-123');
        });

        it('ne devrait rien faire si userConnected vaut null', async () => {
            userConnectedSignal.set(null);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.user()).toBeNull();
            expect(mockProfilService.getProfilCounts).not.toHaveBeenCalled();
        });
    });
});
