import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService, UserDto } from '@ng-vagabond-lab/ng-dsv/module/auth';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TodolistDto } from '../../dto/todolist.dto';
import { TodolistService } from '../../service/todolist.service';
import { TodolistListContainer } from './todolist-list.container';

describe('TodolistListContainer', () => {
    let component: TodolistListContainer;
    let fixture: ComponentFixture<TodolistListContainer>;

    const mockUserConnected = signal<UserDto | undefined>(undefined);
    const mockLoaded = signal<boolean>(true);
    const mockFirstLoad = signal<boolean>(false);
    const mockTodolists = signal<TodolistDto[]>([]);
    const mockSearch = signal<string>('');

    const mockAuthService = {
        userConnected: mockUserConnected,
    };

    const mockTodolistService = {
        loaded: mockLoaded,
        firstLoad: mockFirstLoad,
        todolists: mockTodolists,
        search: mockSearch,
        fetchList: vi.fn(),
        todolistSelected: signal<TodolistDto | undefined>(undefined),
    };

    beforeEach(async () => {
        vi.clearAllMocks();

        mockUserConnected.set(undefined);
        mockLoaded.set(true);
        mockFirstLoad.set(false);
        mockTodolists.set([]);
        mockSearch.set('');

        await TestBed.configureTestingModule({
            imports: [TodolistListContainer],
            providers: [
                provideRouter([]),
                provideTranslateService(),
                { provide: AuthService, useValue: mockAuthService },
                { provide: TodolistService, useValue: mockTodolistService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TodolistListContainer);
        component = fixture.componentInstance;
    });

    describe('Constructor initialization', () => {
        it('when component is instantiated, then it should set loaded to false', () => {
            expect(mockTodolistService.loaded()).toBe(false);
        });
    });

    describe('Auto-fetch effect', () => {
        it('when user is connected, it is not first load and todolists are empty, then it should fetch list', () => {
            mockUserConnected.set({ id: 123 });
            mockFirstLoad.set(false);
            mockTodolists.set([]);

            fixture.detectChanges();

            expect(mockTodolistService.fetchList).toHaveBeenCalledWith(123);
        });

        it('when user is not connected, then it should not fetch list', () => {
            mockUserConnected.set(undefined);
            mockFirstLoad.set(false);
            mockTodolists.set([]);

            fixture.detectChanges();

            expect(mockTodolistService.fetchList).not.toHaveBeenCalled();
        });

        it('when it is the first load, then it should not fetch list', () => {
            mockUserConnected.set({ id: 123, username: 'test', avatar: '' });
            mockFirstLoad.set(true);
            mockTodolists.set([]);

            fixture.detectChanges();

            expect(mockTodolistService.fetchList).not.toHaveBeenCalled();
        });

        it('when todolists array is not empty, then it should not fetch list', () => {
            mockUserConnected.set({ id: 123, username: 'test', avatar: '' });
            mockFirstLoad.set(false);
            mockTodolists.set([
                {
                    id: 1,
                    name: 'Liste existante',
                    avatar: 'dsq',
                    userCreate: { id: 1, avatar: '' },
                } as TodolistDto,
            ]);

            fixture.detectChanges();

            expect(mockTodolistService.fetchList).not.toHaveBeenCalled();
        });
    });

    describe('doFetch action', () => {
        it('when calling doFetch with search term, then it should update search signal and fetch list with user id', () => {
            mockUserConnected.set({ id: 99, username: 'test', avatar: '' });

            component.doFetch('courses');

            expect(mockTodolistService.search()).toBe('courses');
            expect(mockTodolistService.fetchList).toHaveBeenCalledWith(99);
        });

        it('when calling doFetch without parameter, then it should update search signal with empty string and fetch list', () => {
            mockUserConnected.set({ id: 99, username: 'test', avatar: '' });

            component.doFetch();

            expect(mockTodolistService.search()).toBe('');
            expect(mockTodolistService.fetchList).toHaveBeenCalledWith(99);
        });
    });
});
