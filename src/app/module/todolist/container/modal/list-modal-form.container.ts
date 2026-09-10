import { Component, inject } from '@angular/core';
import { BaseContainer } from '@ng-vagabond-lab/ng-dsv/base';
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
}
