import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StoreMap } from '@ng-vagabond-lab/ng-dsv/storage';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TodolistDto, TodolistItemDto } from '../dto/todolist.dto';
import { TodolistService } from '../service/todolist.service';
import { TodolistContainer } from './todolist.container';

describe('TodolistContainer', () => {
    let component: TodolistContainer;
    let fixture: ComponentFixture<TodolistContainer>;

    const mockTodolistMap = new StoreMap<number, TodolistDto>();
    const mockTodolistItemsMap = new StoreMap<number, TodolistItemDto[]>();

    const mockTodolistService = {
        todolist: mockTodolistMap,
        todolistItems: mockTodolistItemsMap,
        fetchTodolistById: vi.fn(),
        addItemToList: vi.fn(),
        order: vi.fn(),
        todolistItemSelected: signal<TodolistItemDto | undefined>(undefined),
    };

    const routeParamsSignal = signal<Record<string, string>>({});
    const userConnectedSignal = signal<boolean>(true);

    beforeEach(async () => {
        vi.clearAllMocks();
        routeParamsSignal.set({});
        userConnectedSignal.set(true);

        await TestBed.configureTestingModule({
            imports: [TodolistContainer],
            providers: [
                provideRouter([]),
                provideTranslateService(),
                { provide: TodolistService, useValue: mockTodolistService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TodolistContainer);
        component = fixture.componentInstance;

        (component as any).routeParams = routeParamsSignal;
        (component as any).authService = {
            userConnected: userConnectedSignal,
        };
    });

    describe('Component creation', () => {
        it('when instantiated, then creates component successfully', () => {
            expect(component).toBeTruthy();
        });
    });

    describe('Effects & Initialization', () => {
        it('when todolistId is valid and user is connected, then fetches todolist', () => {
            routeParamsSignal.set({ todolistId: '42' });
            fixture.detectChanges();

            expect(component.todolistId()).toBe(42);
            expect(mockTodolistService.fetchTodolistById).toHaveBeenCalledWith(42);
        });

        it('when user is not connected, then does not fetch todolist', () => {
            userConnectedSignal.set(false);
            routeParamsSignal.set({ todolistId: '42' });
            fixture.detectChanges();

            expect(mockTodolistService.fetchTodolistById).not.toHaveBeenCalled();
        });

        it('when service stores update, then updates local todolist and items signals', () => {
            const mockList: TodolistDto = { id: 42, name: 'Ma liste', avatar: '' } as TodolistDto;
            const mockItems: TodolistItemDto[] = [
                { id: 1, name: 'Item 1', checked: false, todolist: mockList } as TodolistItemDto,
            ];

            routeParamsSignal.set({ todolistId: '42' });
            fixture.detectChanges();

            mockTodolistMap.set(42, mockList);
            mockTodolistItemsMap.set(42, mockItems);
            fixture.detectChanges();

            expect(component.todolist()).toEqual(mockList);
            expect(component.todolistItems()).toEqual(mockItems);
        });
    });

    describe('Business Actions', () => {
        it('when doChecked is called, then toggles checked state and saves item', () => {
            const item: TodolistItemDto = { id: 1, name: 'Tâche 1', checked: false } as any;

            component.doChecked(item);

            expect(mockTodolistService.addItemToList).toHaveBeenCalledWith({
                ...item,
                checked: true,
            });
        });

        it('when doCreate is called with name, then adds item and resets form', () => {
            const mockList: TodolistDto = { id: 42, title: 'Ma liste' } as any;
            component.todolist.set(mockList);

            component.itemForm().value.set({ name: 'Nouvelle tâche' });

            mockTodolistService.addItemToList.mockImplementation((dto: any, callback?: () => void) => {
                if (callback) callback();
            });

            component.doCreate();

            expect(mockTodolistService.addItemToList).toHaveBeenCalledWith(
                { name: 'Nouvelle tâche', todolist: mockList },
                expect.any(Function),
            );
            expect(component.itemForm().value().name).toBe('');
        });

        it('when doCreate is called with empty name, then does not add item', () => {
            component.itemForm().value.set({ name: '' });

            component.doCreate();

            expect(mockTodolistService.addItemToList).not.toHaveBeenCalled();
        });

        it('when doDrop is called, then reorders items and notifies service', () => {
            const initialItems: TodolistItemDto[] = [
                { id: 1, name: 'A' } as any,
                { id: 2, name: 'B' } as any,
            ];
            component.todolistItems.set([...initialItems]);

            const mockDropEvent = {
                previousIndex: 0,
                currentIndex: 1,
            } as CdkDragDrop<TodolistItemDto[]>;

            component.doDrop(mockDropEvent);

            const reorderedItems = component.todolistItems()!;
            expect(reorderedItems[0].name).toBe('B');
            expect(reorderedItems[1].name).toBe('A');
            expect(mockTodolistService.order).toHaveBeenCalledWith(reorderedItems);
        });
    });
});
