import { Component, effect, inject, input, output } from '@angular/core';
import { BaseSearchContainer } from '@ng-vagabond-lab/ng-dsv/base';
import { DateFormatPipe } from '@ng-vagabond-lab/ng-dsv/date';
import { DsvCardComponent } from '@ng-vagabond-lab/ng-dsv/ds/card';
import { DsvFormReactiveSearchbarComponent } from '@ng-vagabond-lab/ng-dsv/ds/form/reactive';
import { DsvModalButtonComponent, DsvModalComponent, ModalService } from '@ng-vagabond-lab/ng-dsv/ds/modal';
import { DsvScrollInfiniteContainer } from '@ng-vagabond-lab/ng-dsv/ds/scroll';
import { NotificationDto } from '@ng-vagabond-lab/ng-dsv/module/notification';
import { TodolistDto, TodolistItemDto } from '../../dto/todolist.dto';
import { TodolistNotificationService } from '../../service/notification/todolist-notification.service';

@Component({
    selector: 'app-todolist-notification-container',
    imports: [
        DsvModalButtonComponent,
        DsvModalComponent,
        DsvCardComponent,
        DsvScrollInfiniteContainer,
        DateFormatPipe,
        DsvFormReactiveSearchbarComponent,
    ],
    templateUrl: './todolist-notification.container.html',
    styleUrls: ['./todolist-notification.container.scss'],
})
export class MovieModalSearchContainer extends BaseSearchContainer<
    TodolistNotificationService,
    NotificationDto
> {
    readonly modalService = inject(ModalService);

    modalName = input<string>('list-item-notification');
    todolist = input<TodolistDto>();

    callback = output<TodolistItemDto>();

    constructor(public listItemNotificationService: TodolistNotificationService) {
        super(listItemNotificationService);
        effect(() => {
            this.listItemNotificationService.todolistId.set(this.todolist()?.id);
        });
        effect(() => {
            if (!this.modalService.getSignal(this.modalName())) {
                this.listItemNotificationService.notifications.set([]);
                this.listItemNotificationService.page.set(1);
                this.listItemNotificationService.search.set('');
                this.listItemNotificationService.lasturl.set('');
            }
        });
    }

    override doFetch(search: string | undefined = this.service?.search()) {
        if (this.modalService.getSignal(this.modalName()) && this.todolist()) {
            super.doFetch(search);
        }
    }
}
