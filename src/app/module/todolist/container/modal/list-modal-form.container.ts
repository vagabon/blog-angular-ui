import { Component, computed, inject } from '@angular/core';
import { BaseContainer } from '@ng-vagabond-lab/ng-dsv/base';
import { ModalService } from '@ng-vagabond-lab/ng-dsv/ds/modal';
import { TodolistModalDeleteComponent } from '../../component/modal/delete/todolist-modal-delete.component';
import { ListModalFormComponent } from '../../component/modal/form/list-modal-form.component';
import { TodolistService } from '../../service/todolist.service';

@Component({
    selector: 'app-list-modal-form-container',
    imports: [ListModalFormComponent, TodolistModalDeleteComponent],
    templateUrl: './list-modal-form.container.html',
})
export class ListModalFormContainer extends BaseContainer {
    readonly todolistService = inject(TodolistService);
    readonly modalService = inject(ModalService);

    readonly isFormModalOpen = computed(() => {
        return this.modalService.getSignal('modal-totolist-form');
    });
}
