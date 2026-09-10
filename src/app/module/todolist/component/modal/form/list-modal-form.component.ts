import { Component, effect, input, output, signal } from '@angular/core';
import { form, validate } from '@angular/forms/signals';
import {
    DsvFormSignalComponent,
    DsvFormSignalInputComponent,
    DsvFormSignalSelectComponent,
    requiredTrim,
} from '@ng-vagabond-lab/ng-dsv/ds/form/signal';
import { DsvModalComponent } from '@ng-vagabond-lab/ng-dsv/ds/modal';
import { UserDto } from '@ng-vagabond-lab/ng-dsv/module/auth';
import { TodolistDto, TodolListIconDto } from 'app/module/todolist/dto/todolist.dto';

export const ICONES: TodolListIconDto[] = [
    { name: 'Films', id: 'ri-film-line' },
    { name: 'Séries', id: 'ri-tv-2-line' },
    { name: 'Personnes', id: 'ri-user-line' },
    { name: 'Favoris', id: 'ri-heart-line' },
    { name: 'À voir', id: 'ri-bookmark-line' },
    { name: 'Vus', id: 'ri-eye-line' },
    { name: 'Animés', id: 'ri-sword-line' },
    { name: 'Documentaires', id: 'ri-camera-lens-line' },
    { name: 'Acteurs', id: 'ri-award-line' },
    { name: 'Réalisateurs', id: 'ri-movie-2-line' },
    { name: 'Musiques', id: 'ri-music-2-line' },
    { name: 'Collections', id: 'ri-stack-line' },
    { name: 'Classiques', id: 'ri-time-line' },
    { name: 'Coups de cœur', id: 'ri-star-line' },
    { name: 'En cours', id: 'ri-loader-line' },
    { name: 'Abandonné', id: 'ri-close-circle-line' },
    { name: 'Saga', id: 'ri-links-line' },
    { name: 'Streaming', id: 'ri-play-circle-line' },
    { name: 'Cinéma', id: 'ri-building-line' },
    { name: 'Personnages', id: 'ri-spy-line' },
];

@Component({
    selector: 'app-list-modal-form',
    imports: [
        DsvModalComponent,
        DsvFormSignalComponent,
        DsvFormSignalInputComponent,
        DsvFormSignalSelectComponent,
    ],
    templateUrl: './list-modal-form.component.html',
    styleUrls: ['./list-modal-form.component.scss'],
})
export class ListModalFormComponent {
    readonly userConnected = input<UserDto | null>(null);
    readonly listSelected = input<TodolistDto | undefined>(undefined);
    readonly modalName = input<string>('modal-totolist-form');

    readonly callback = output<TodolistDto>();

    readonly listForm = form<TodolistDto>(signal(this.initValue(this.listSelected())), (path) => {
        validate(path.name, requiredTrim);
    });

    readonly icons = signal<TodolListIconDto[]>(ICONES);

    constructor() {
        effect(() => {
            this.listForm().reset(this.initValue(this.listSelected()));
        });
    }

    initValue(list?: TodolistDto): TodolistDto {
        const icon = 'ri-film-line';
        if (list) {
            if (!list.avatar) {
                list.avatar = icon;
            }
            return list;
        }
        return {
            name: '',
            avatar: icon,
        } as TodolistDto;
    }

    doSubmit(): void {
        this.callback.emit(this.listForm().value());
        this.listForm().reset(this.initValue());
    }
}
