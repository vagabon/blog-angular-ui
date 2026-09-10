import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@ng-vagabond-lab/ng-dsv/api';
import { ModalService } from '@ng-vagabond-lab/ng-dsv/ds/modal';
import { AuthService } from '@ng-vagabond-lab/ng-dsv/module/auth';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TodolistDto, TodolistItemDto } from '../dto/todolist.dto';
import { TodolistService } from './todolist.service';

describe('TodolistService', () => {
    let service: TodolistService;

    const mockApiService = {
        get: vi.fn(),
        createOrUpdate: vi.fn(),
        delete: vi.fn(),
        put: vi.fn(),
    };

    const mockModalService = {
        open: vi.fn(),
        close: vi.fn(),
    };

    const mockUserConnected = signal<{ id: number } | undefined>({ id: 10 });
    const mockAuthService = {
        userConnected: mockUserConnected,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockUserConnected.set({ id: 10 });

        TestBed.configureTestingModule({
            providers: [
                provideTranslateService(),
                TodolistService,
                { provide: ApiService, useValue: mockApiService },
                { provide: ModalService, useValue: mockModalService },
                { provide: AuthService, useValue: mockAuthService },
            ],
        });

        service = TestBed.inject(TodolistService);
        (service as any).apiService = mockApiService;
    });

    describe('Service initialization', () => {
        it('when instantiated, then initializes default signals and maps', () => {
            expect(service.todolists()).toEqual([]);
            expect(service.search()).toBe('');
            expect(service.firstLoad()).toBe(false);
            expect(service.todolist.size()).toBe(0);
            expect(service.todolistItems.size()).toBe(0);
        });
    });

    describe('fetchList', () => {
        it('when called, then updates state and calls api search endpoint', () => {
            service.search.set('films');
            mockApiService.get.mockImplementation((url: string, callback: (data: any) => void) => {
                callback({ content: [{ id: 1, name: 'Films' }] });
            });

            service.fetchList(10, 2);

            expect(service.loaded()).toBe(true);
            expect(service.firstLoad()).toBe(true);
            expect(service.todolists()).toEqual([{ id: 1, name: 'Films' }]);
            expect(mockApiService.get).toHaveBeenCalledWith(
                '/todolist/list/findByUser?userId=10&search=films&page=2',
                expect.any(Function),
            );
        });
    });

    describe('fetchTodolistById', () => {
        it('when called, then fetches todolist detail and items', () => {
            const mockList = { id: 1, name: 'Films' } as TodolistDto;
            const mockItems = [{ id: 101, name: 'Inception' }] as TodolistItemDto[];

            mockApiService.get.mockImplementation((url: string, callback: (data: any) => void) => {
                if (url.includes('/todolist/list/1')) {
                    callback(mockList);
                } else if (url.includes('/todolist/item/findBy')) {
                    callback({ content: mockItems });
                }
            });

            service.fetchTodolistById(1);

            expect(service.todolist.get(1)).toEqual(mockList);
            expect(service.todolistItems.get(1)).toEqual(mockItems);
        });
    });

    describe('Modal triggers', () => {
        it('when doSelectList is called, then sets todolistSelected and opens form modal', () => {
            const mockList = { id: 1, name: 'Séries' } as TodolistDto;

            service.doSelectList(mockList);

            expect(service.todolistSelected()).toEqual(mockList);
            expect(mockModalService.open).toHaveBeenCalledWith('modal-totolist-form');
        });

        it('when doDeleteSelectList is called, then sets todolistSelected and opens delete modal', () => {
            const mockList = { id: 1, name: 'Séries' } as TodolistDto;

            service.doDeleteSelectList(mockList);

            expect(service.todolistSelected()).toEqual(mockList);
            expect(mockModalService.open).toHaveBeenCalledWith('modal-totolist-delete');
        });

        it('when doDeleteSelectItem is called, then sets todolistItemSelected and opens delete modal', () => {
            const mockItem = { id: 50, name: 'Breaking Bad' } as TodolistItemDto;

            service.doDeleteSelectItem(mockItem);

            expect(service.todolistItemSelected()).toEqual(mockItem);
            expect(mockModalService.open).toHaveBeenCalledWith('modal-totolist-delete');
        });
    });

    describe('addTodolist', () => {
        it('when adding new todolist, then calls api create with creation message', () => {
            const mockList = { name: 'Animes' } as TodolistDto;

            service.addTodolist(mockList);

            expect(mockApiService.createOrUpdate).toHaveBeenCalled();
        });

        it('when updating existing todolist, then calls api update with update message', () => {
            const mockList = { id: 2, name: 'Animes' } as TodolistDto;
            mockApiService.createOrUpdate.mockImplementation(
                (url: string, data: any, callback: () => void) => {
                    callback();
                },
            );
            mockApiService.get.mockImplementation((url: string, callback: (data: any) => void) => {
                callback({ content: [] });
            });

            service.addTodolist(mockList);

            expect(mockApiService.createOrUpdate).toHaveBeenCalled();
            expect(mockModalService.close).toHaveBeenCalledWith('modal-totolist-form');
        });
    });

    describe('deleteTodolist', () => {
        it('when delete succeeds, then filters out deleted todolist and closes modal', () => {
            service.todolists.set([
                { id: 1, name: 'Films' } as TodolistDto,
                { id: 2, name: 'Livres' } as TodolistDto,
            ]);
            service.todolistSelected.set({ id: 1, name: 'Films' } as TodolistDto);

            mockApiService.delete.mockImplementation((url: string, callback: () => void) => {
                callback();
            });

            service.deleteTodolist();

            expect(mockApiService.delete).toHaveBeenCalledWith(
                '/todolist/list/desactivate?id=1',
                expect.any(Function),
            );
            expect(service.todolists()).toEqual([{ id: 2, name: 'Livres' }]);
            expect(mockModalService.close).toHaveBeenCalledWith('modal-totolist-delete');
        });
    });

    describe('addItemToList', () => {
        it('when creating new item, then prepends item, reorders, saves order and calls callback', () => {
            const callback = vi.fn();
            const mockList = { id: 5 } as TodolistDto;
            const existingItems: TodolistItemDto[] = [
                { id: 101, name: 'Ancien', orderNumber: 1, todolist: mockList } as TodolistItemDto,
            ];
            service.todolistItems.set(5, [...existingItems]);

            const newItem = { name: 'Nouveau', todolist: mockList } as TodolistItemDto;
            const createdItem = { id: 102, name: 'Nouveau', todolist: mockList } as TodolistItemDto;

            mockApiService.createOrUpdate.mockImplementation(
                (url: string, item: any, cb: (data: any) => void) => {
                    cb(createdItem);
                },
            );

            service.addItemToList(newItem, callback);

            const updatedItems = service.todolistItems.get(5)!;
            expect(updatedItems).toHaveLength(2);
            expect(updatedItems[0]).toEqual({ id: 102, name: 'Nouveau', todolist: mockList, orderNumber: 1 });
            expect(updatedItems[1]).toEqual({ id: 101, name: 'Ancien', todolist: mockList, orderNumber: 2 });
            expect(mockApiService.put).toHaveBeenCalledWith('/todolist/item/order', updatedItems);
            expect(callback).toHaveBeenCalled();
        });

        it('when updating existing item, then calls api update without reordering', () => {
            const mockList = { id: 5 } as TodolistDto;
            const existingItem = { id: 101, name: 'Item', todolist: mockList } as TodolistItemDto;

            mockApiService.createOrUpdate.mockImplementation(
                (url: string, item: any, cb: (data: any) => void) => {
                    cb(item);
                },
            );

            service.addItemToList(existingItem);

            expect(mockApiService.createOrUpdate).toHaveBeenCalledWith(
                'todolist/item',
                existingItem,
                expect.any(Function),
            );
            expect(mockApiService.put).not.toHaveBeenCalled();
        });
    });

    describe('deleteTodolistItem', () => {
        it('when delete succeeds, then removes item, reorders remaining items and closes modal', () => {
            const mockList = { id: 8 } as TodolistDto;
            const item1 = { id: 1, name: 'Item 1', todolist: mockList } as TodolistItemDto;
            const item2 = { id: 2, name: 'Item 2', todolist: mockList } as TodolistItemDto;

            service.todolistItems.set(8, [item1, item2]);
            service.todolistItemSelected.set(item1);

            mockApiService.delete.mockImplementation((url: string, callback: () => void) => {
                callback();
            });

            service.deleteTodolistItem();

            const remainingItems = service.todolistItems.get(8)!;
            expect(remainingItems).toEqual([{ ...item2, orderNumber: 1 }]);
            expect(mockApiService.put).toHaveBeenCalledWith('/todolist/item/order', remainingItems);
            expect(mockModalService.close).toHaveBeenCalledWith('modal-totolist-delete');
        });
    });

    describe('order', () => {
        it('when reordering items, then reindexes orderNumber, updates store and calls api put', () => {
            const mockList = { id: 3 } as TodolistDto;
            const items: TodolistItemDto[] = [
                { id: 20, name: 'Second', todolist: mockList } as TodolistItemDto,
                { id: 10, name: 'Premier', todolist: mockList } as TodolistItemDto,
            ];

            service.order(items);

            const expectedItems = [
                { id: 20, name: 'Second', todolist: mockList, orderNumber: 1 },
                { id: 10, name: 'Premier', todolist: mockList, orderNumber: 2 },
            ];

            expect(service.todolistItems.get(3)).toEqual(expectedItems);
            expect(mockApiService.put).toHaveBeenCalledWith('/todolist/item/order', expectedItems);
        });
    });
});
