import { Component, effect, inject } from '@angular/core';
import { DsvAvatarComponent } from '@ng-vagabond-lab/ng-dsv/ds/avatar';
import { DsvButtonComponent } from '@ng-vagabond-lab/ng-dsv/ds/button';
import { DsvCardComponent, DsvCardHeaderComponent } from '@ng-vagabond-lab/ng-dsv/ds/card';
import { DsvChipComponent } from '@ng-vagabond-lab/ng-dsv/ds/chip';
import { DsvFormSignalSearchbarComponent } from '@ng-vagabond-lab/ng-dsv/ds/form/signal';
import { DsvScrollInfiniteContainer } from '@ng-vagabond-lab/ng-dsv/ds/scroll';
import { AuthService } from '@ng-vagabond-lab/ng-dsv/module/auth';
import { TodolistIconComponent } from '../../component/icon/todolist-icon.component';
import { TodolistService } from '../../service/todolist.service';
import { ListModalFormContainer } from '../modal/list-modal-form.container';

@Component({
    selector: 'app-todolist-list',
    imports: [
        DsvFormSignalSearchbarComponent,
        DsvCardComponent,
        DsvScrollInfiniteContainer,
        DsvAvatarComponent,
        DsvChipComponent,
        DsvCardHeaderComponent,
        TodolistIconComponent,
        ListModalFormContainer,
        DsvButtonComponent,
    ],
    styleUrls: ['../todolist.container.scss', './todolist-list.container.scss'],
    templateUrl: './todolist-list.container.html',
})
export class TodolistListContainer {
    readonly authService = inject(AuthService);
    readonly todolistService = inject(TodolistService);

    constructor() {
        this.todolistService.loaded.set(false);
        effect(() => {
            if (
                this.authService.userConnected() &&
                !this.todolistService.firstLoad() &&
                this.todolistService.todolists().length === 0
            ) {
                this.doFetch();
            }
        });
    }

    doFetch(search: string = ''): void {
        this.todolistService.search.set(search);
        this.todolistService.fetchList(this.authService.userConnected()?.id);
    }
}
