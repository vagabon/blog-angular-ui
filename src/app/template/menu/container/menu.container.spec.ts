import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuService } from '@ng-vagabond-lab/ng-dsv/ds/menu';
import { MenuContainer } from './menu.container';

describe('MenuComponent', () => {
    let component: MenuContainer;
    let fixture: ComponentFixture<MenuContainer>;
    let mockMenuService: jasmine.SpyObj<MenuService>;

    beforeEach(async () => {
        mockMenuService = jasmine.createSpyObj<MenuService>('MenuService', ['isMenuOpen', 'toogleMenu']);

        await TestBed.configureTestingModule({
            imports: [MenuContainer],
            providers: [
                provideZonelessChangeDetection(),
                provideHttpClient(),
                { provide: MenuService, useValue: mockMenuService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MenuContainer);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should call toogleMenu if menu is open', () => {
        mockMenuService.isMenuOpen.and.returnValue(true);

        component.closeMenu();

        expect(mockMenuService.isMenuOpen).toHaveBeenCalled();
        expect(mockMenuService.toogleMenu).toHaveBeenCalled();
    });

    it('should not call toogleMenu if menu is closed', () => {
        mockMenuService.isMenuOpen.and.returnValue(false);

        component.closeMenu();

        expect(mockMenuService.isMenuOpen).toHaveBeenCalled();
        expect(mockMenuService.toogleMenu).not.toHaveBeenCalled();
    });
});
