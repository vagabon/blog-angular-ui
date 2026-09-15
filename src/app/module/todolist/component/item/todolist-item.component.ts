import { Component, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { form } from '@angular/forms/signals';
import { DsvButtonComponent } from '@ng-vagabond-lab/ng-dsv/ds/button';
import {
    DsvFormSignalCheckboxComponent,
    DsvFormSignalInputComponent,
} from '@ng-vagabond-lab/ng-dsv/ds/form/signal';
import { TodolistItemDto } from '../../dto/todolist.dto';

@Component({
    imports: [DsvFormSignalCheckboxComponent, DsvButtonComponent, DsvFormSignalInputComponent],
    selector: 'app-todolist-item',
    styleUrl: './todolist-item.component.scss',
    templateUrl: './todolist-item.component.html',
})
export class TodolistItemComponent {
    readonly todolistItem = input<TodolistItemDto>();
    readonly dragged = input<boolean>();

    readonly callback = output<TodolistItemDto>();
    readonly callbackUpdate = output<string>();
    readonly callbackDelete = output<TodolistItemDto>();

    readonly checkboxRef = viewChild<ElementRef>('checkbox');

    readonly readForm = form<TodolistItemDto>(signal({} as TodolistItemDto));

    readonly update = signal<boolean>(false);

    constructor() {
        effect(() => {
            this.readForm().reset({
                checked: this.todolistItem()?.checked,
                name: this.todolistItem()?.name,
            } as TodolistItemDto);
        });
    }

    triggerCheckbox(): void {
        !this.update() && !this.dragged() && this.checkboxRef()?.nativeElement.querySelector('input').click();
    }

    doChange(): void {
        this.update.set(false);
        this.callbackUpdate.emit(this.readForm().value().name);
    }
}
