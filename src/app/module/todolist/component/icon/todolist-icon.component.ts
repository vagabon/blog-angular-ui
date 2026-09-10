import { Component, input } from '@angular/core';

@Component({
    imports: [],
    selector: 'app-todolist-icon',
    styleUrl: './todolist-icon.component.scss',
    templateUrl: './todolist-icon.component.html',
})
export class TodolistIconComponent {
    readonly icon = input<string>('');
}
