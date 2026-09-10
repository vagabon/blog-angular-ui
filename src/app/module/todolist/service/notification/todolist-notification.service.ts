import { Injectable, signal } from '@angular/core';
import { ID } from '@ng-vagabond-lab/ng-dsv/api';
import { NotificationSearchService } from '@ng-vagabond-lab/ng-dsv/module/notification';

@Injectable({ providedIn: 'root' })
export class TodolistNotificationService extends NotificationSearchService {
    readonly todolistId = signal<ID | undefined>(undefined);

    override getParams(): string {
        return '&category=TODOLIST&entityId=' + this.todolistId();
    }
}
