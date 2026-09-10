import { Component, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { form } from '@angular/forms/signals';
import { DsvButtonComponent } from '@ng-vagabond-lab/ng-dsv/ds/button';
import { DsvFormSignalCheckboxComponent } from '@ng-vagabond-lab/ng-dsv/ds/form/signal';
import { TodolistItemDto } from '../../dto/todolist.dto';
import { TodolistIconComponent } from '../icon/todolist-icon.component';

@Component({
    imports: [DsvFormSignalCheckboxComponent, TodolistIconComponent, DsvButtonComponent],
    selector: 'app-todolist-item',
    styleUrl: './todolist-item.component.scss',
    templateUrl: './todolist-item.component.html',
})
export class TodolistItemComponent {
    readonly todolistItem = input<TodolistItemDto>();

    readonly callback = output<TodolistItemDto>();
    readonly callbackDelete = output<TodolistItemDto>();

    readonly checkboxRef = viewChild<ElementRef>('checkbox');

    readonly readForm = form(
        signal({
            checked: this.todolistItem()?.checked,
        }),
    );

    constructor() {
        effect(() => {
            this.readForm().reset({
                checked: this.todolistItem()?.checked,
            });
        });
    }

    triggerCheckbox(): void {
        this.checkboxRef()?.nativeElement.querySelector('input').click();
    }
}
