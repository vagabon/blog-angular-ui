import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, effect, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { BaseRouteContainer } from '@ng-vagabond-lab/ng-dsv/base';
import { DsvButtonComponent } from '@ng-vagabond-lab/ng-dsv/ds/button';
import { DsvCardComponent, DsvCardHeaderComponent } from '@ng-vagabond-lab/ng-dsv/ds/card';
import { DsvFormSignalInputComponent } from '@ng-vagabond-lab/ng-dsv/ds/form/signal';
import { DsvScrollInfiniteContainer } from '@ng-vagabond-lab/ng-dsv/ds/scroll';
import { TodolistItemComponent } from '../component/item/todolist-item.component';
import { TodolistModalDeleteComponent } from '../component/modal/delete/todolist-modal-delete.component';
import { TodolistDto, TodolistItemDto } from '../dto/todolist.dto';
import { TodolistService } from '../service/todolist.service';
import { MovieModalSearchContainer } from './notification/todolist-notification.container';

@Component({
    imports: [
        DsvCardComponent,
        DsvCardHeaderComponent,
        DsvButtonComponent,
        RouterLink,
        DsvScrollInfiniteContainer,
        MovieModalSearchContainer,
        TodolistItemComponent,
        DsvFormSignalInputComponent,
        TodolistModalDeleteComponent,
        CdkDropList,
        CdkDrag,
    ],
    selector: 'app-todolist',
    styleUrl: './todolist.container.scss',
    templateUrl: './todolist.container.html',
})
export class TodolistContainer extends BaseRouteContainer {
    readonly todolistService = inject(TodolistService);

    readonly todolistId = signal<number>(0);
    readonly todolist = signal<TodolistDto | undefined>(undefined);
    readonly todolistItems = signal<TodolistItemDto[] | undefined>([]);

    readonly created = signal<boolean>(false);

    readonly itemForm = form(
        signal({
            name: '',
        }),
    );

    constructor() {
        super();
        effect(() => {
            const todolistId = Number(this.routeParams()?.['todolistId']);
            if (Number.isInteger(todolistId) && this.authService.userConnected()) {
                this.todolistId?.set(todolistId);
                this.todolistService.fetchTodolistById(todolistId);
            }
        });
        effect(() => {
            if (this.todolistId() && this.todolistService.todolist.get(this.todolistId())) {
                this.todolist?.set(this.todolistService.todolist.get(this.todolistId()));
            }
        });
        effect(() => {
            if (this.todolistId() && this.todolistService.todolistItems.get(this.todolistId())) {
                this.todolistItems?.set(this.todolistService.todolistItems.get(this.todolistId()));
            }
        });
    }

    doChecked(todolistItem: TodolistItemDto): void {
        todolistItem = { ...todolistItem, checked: !todolistItem.checked };
        this.todolistService.addItemToList(todolistItem);
    }

    doCreate(): void {
        const name = this.itemForm().value().name;
        name !== '' &&
            this.todolistService.addItemToList(
                { name: name, todolist: this.todolist() } as TodolistItemDto,
                () => {
                    this.itemForm().reset({
                        name: '',
                    });
                },
            );
    }

    doDrop(event: CdkDragDrop<TodolistItemDto[]>): void {
        moveItemInArray(this.todolistItems()!, event.previousIndex, event.currentIndex);
        this.todolistService.order(this.todolistItems()!);
    }
}
