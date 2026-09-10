import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalService } from '@ng-vagabond-lab/ng-dsv/ds/modal';
import { AuthGoogleService } from '@ng-vagabond-lab/ng-dsv/module/auth';
import { provideTranslateService } from '@ngx-translate/core';
import { TodolistDto } from 'app/module/todolist/dto/todolist.dto';
import { TodolistService } from 'app/module/todolist/service/todolist.service';
import { ListModalFormComponent } from './list-modal-form.component';

const mockLists: TodolistDto[] = [
    { id: 1, name: 'Liste A', avatar: 'ri-film-line', nbItems: 2 },
    { id: 2, name: 'Liste B', avatar: 'ri-tv-2-line', nbItems: 5 },
] as TodolistDto[];

const mockListItem: TodolistDto | undefined = {
    id: 1,
} as TodolistDto;

const createModalService = () => {
    const states = new Map<string, ReturnType<typeof signal<boolean>>>();
    return {
        getSignal: vi.fn((id: string) => {
            if (!states.has(id)) states.set(id, signal(false));
            return states.get(id)?.() ?? false;
        }),
        open: vi.fn((id: string) => states.get(id)?.set(true)),
        close: vi.fn((id: string) => states.get(id)?.set(false)),
        toggle: vi.fn(),
        _states: states,
    };
};

const mockListService = {
    lists: signal<TodolistDto[]>(mockLists),
    listSelected: signal<TodolistDto | undefined>(mockListItem),
};

describe('ListModalFormContainer', () => {
    let fixture: ComponentFixture<ListModalFormComponent>;
    let component!: ListModalFormComponent;
    let modalService: ReturnType<typeof createModalService>;

    beforeEach(async () => {
        modalService = createModalService();

        await TestBed.configureTestingModule({
            imports: [ListModalFormComponent],
            providers: [
                provideTranslateService(),
                { provide: TodolistService, useValue: mockListService },
                { provide: ModalService, useValue: modalService },
                { provide: AuthGoogleService, useValue: { initGoogleAuth: vi.fn() } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ListModalFormComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('initValue', () => {
        it('should return default value when no listItem provided', () => {
            const result = component.initValue();
            expect(result.name).toBe('');
        });

        it('should return listItem when provided', () => {
            const result = component.initValue(mockListItem);
            expect(result).toEqual(mockListItem);
        });
    });

    describe('doSubmit', () => {
        it('should emit callback with listItem and mapped list id', () => {
            let emitted: TodolistDto | undefined = { id: 1 } as TodolistDto;
            component.callback.subscribe((item) => (emitted = item));

            component.listForm().value.set({ name: 'Batman', id: 1 } as TodolistDto);
            component.doSubmit();

            expect(emitted?.id).toEqual(1);
        });
    });
});
