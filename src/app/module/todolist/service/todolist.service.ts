import { inject, Service, signal } from '@angular/core';
import { ID, PageableDto } from '@ng-vagabond-lab/ng-dsv/api';
import { BaseApiService } from '@ng-vagabond-lab/ng-dsv/base/service';
import { ModalService } from '@ng-vagabond-lab/ng-dsv/ds/modal';
import { AuthService } from '@ng-vagabond-lab/ng-dsv/module/auth';
import { StoreMap } from '@ng-vagabond-lab/ng-dsv/storage';
import { TodolistDto, TodolistItemDto } from '../dto/todolist.dto';

@Service()
export class TodolistService extends BaseApiService {
    readonly modalService = inject(ModalService);
    readonly authService = inject(AuthService);

    readonly todolists = signal<TodolistDto[]>([]);
    readonly search = signal<string>('');
    readonly firstLoad = signal<boolean>(false);

    readonly todolist = new StoreMap<ID, TodolistDto>();
    readonly todolistItems = new StoreMap<ID, TodolistItemDto[]>();

    readonly todolistSelected = signal<TodolistDto | undefined>(undefined);
    readonly todolistItemSelected = signal<TodolistItemDto | undefined>(undefined);

    fetchList(userId: ID, page: number = 0): void {
        this.loaded.set(false);
        this.apiService.get<PageableDto<TodolistDto[]>>(
            `/todolist/list/findByUser?userId=${userId}&search=${this.search()}&page=${page}`,
            (data) => {
                this.todolists.set(data.content);
                this.loaded.set(true);
                this.firstLoad.set(true);
            },
        );
    }

    fetchTodolistById(id: ID): void {
        this.apiService.get<TodolistDto>(`/todolist/list/${id}`, (data) => {
            this.todolist.set(id, data);
        });

        this.apiService.get<PageableDto<TodolistItemDto[]>>(
            `/todolist/item/findBy?fields=todolist.idAndActive>>orderNumber&values=${id},true&first=0&max=500`,
            (data) => {
                this.todolistItems.set(id, data.content);
            },
        );
    }

    doSelectList(list: TodolistDto | undefined = undefined): void {
        this.todolistSelected.set(list);
        this.modalService.open('modal-totolist-form');
    }

    doDeleteSelectList(list: TodolistDto | undefined = undefined): void {
        this.todolistSelected.set(list);
        this.modalService.open('modal-totolist-delete');
    }

    doDeleteSelectItem(list: TodolistItemDto | undefined = undefined): void {
        this.todolistItemSelected.set(list);
        this.modalService.open('modal-totolist-delete');
    }

    addTodolist(list: TodolistDto): void {
        const text = list.id
            ? "La liste '" + list.name + "' a bien été mise à jour."
            : "La liste '" + list.name + "' a bien été crée.";
        this.apiService.createOrUpdate(
            'todolist/list',
            list,
            () => {
                this.fetchList(this.authService.userConnected()?.id, 0);
                this.modalService.close('modal-totolist-form');
            },
            text,
        );
    }

    deleteTodolist(): void {
        this.apiService.delete<TodolistDto[]>(
            '/todolist/list/desactivate?id=' + this.todolistSelected()?.id,
            () => {
                this.todolists.set(
                    this.todolists()?.filter((list) => list.id !== this.todolistSelected()?.id),
                );

                this.modalService.close('modal-totolist-delete');
            },
        );
    }

    addItemToList(list: TodolistItemDto, callback?: () => void): void {
        const isCreate = list.id === undefined;
        this.apiService.createOrUpdate('todolist/item', list, (data) => {
            if (isCreate) {
                let items = this.todolistItems.get(list.todolist?.id);
                items?.unshift(data);
                let order = 0;
                this.todolistItems.set(
                    list.todolist?.id,
                    items?.map((item) => {
                        order++;
                        return { ...item, orderNumber: order };
                    })!,
                );
                this.order(this.todolistItems.get(list.todolist?.id)!);
            }
            callback?.();
        });
    }

    deleteTodolistItem(): void {
        this.apiService.delete<TodolistItemDto[]>(
            '/todolist/item/desactivate?id=' + this.todolistItemSelected()?.id,
            () => {
                const items = this.todolistItems.get(this.todolistItemSelected()?.todolist?.id);
                let order = 0;
                this.todolistItems.set(
                    this.todolistItemSelected()?.todolist?.id,
                    items
                        ?.filter((item) => item.id !== this.todolistItemSelected()?.id)
                        ?.map((item) => {
                            order++;
                            return { ...item, orderNumber: order };
                        })!,
                );
                this.order(this.todolistItems.get(this.todolistItemSelected()?.todolist?.id)!);

                this.modalService.close('modal-totolist-delete');
            },
        );
    }

    order(items: TodolistItemDto[]) {
        let order = 0;
        items = items.map((item) => {
            order++;
            return { ...item, orderNumber: order };
        });
        this.todolistItems.set(items[0].todolist?.id, items);
        this.apiService.put('/todolist/item/order', items);
    }
}
