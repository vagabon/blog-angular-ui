import { Component, effect, input, output, signal } from '@angular/core';
import { DsvModalAlertComponent } from '@ng-vagabond-lab/ng-dsv/ds/modal';
import { TodolistDto, TodolistItemDto } from 'app/module/todolist/dto/todolist.dto';

@Component({
    selector: 'app-list-modal-delete',
    imports: [DsvModalAlertComponent],
    templateUrl: './todolist-modal-delete.component.html',
})
export class TodolistModalDeleteComponent {
    readonly item = input.required<TodolistDto | TodolistItemDto>();

    readonly modalName = input<string>('modal-totolist-delete');

    readonly callback = output<TodolistDto | TodolistItemDto>();

    readonly title = signal<string>('');
    readonly text = signal<string>('');

    constructor() {
        effect(() => {
            if ((this.item() as TodolistItemDto)?.todolist) {
                this.title.set("Supprimer l'élément : " + (this.item() as TodolistItemDto).name);
                this.text.set(
                    "Souhaitez-vous vraiment supprimer l'émement '" +
                        (this.item() as TodolistItemDto).name +
                        "' de la liste : '" +
                        (this.item() as TodolistItemDto).todolist.name +
                        "' ?",
                );
            } else if ((this.item() as TodolistDto)?.id) {
                this.title.set('Supprimer la liste : ' + (this.item() as TodolistDto).name);
                this.text.set(
                    "Souhaitez-vous vraiment supprimer la liste '" +
                        (this.item() as TodolistDto).name +
                        "' ?",
                );
            }
        });
    }
}
