import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { TodolistDto } from 'app/module/todolist/dto/todolist.dto';
import { TodolistModalDeleteComponent } from './todolist-modal-delete.component';

const mockItem: TodolistDto = { id: 42, name: 'Ma liste' } as TodolistDto;

describe('ListModalDeleteComponent', () => {
    let fixture: ComponentFixture<TodolistModalDeleteComponent>;
    let component!: TodolistModalDeleteComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TodolistModalDeleteComponent],
            providers: [provideTranslateService()],
        }).compileComponents();

        fixture = TestBed.createComponent(TodolistModalDeleteComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('item', mockItem);
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('delele todolist', async () => {
        fixture.componentRef.setInput('item', {
            id: 42,
            name: 'name',
        });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.title()).toBe('Supprimer la liste : name');
        expect(component.text()).toBe("Souhaitez-vous vraiment supprimer la liste 'name' ?");
    });

    it('delele todolist item', async () => {
        fixture.componentRef.setInput('item', {
            id: 42,
            name: 'name',
            todolist: { name: 'todolist' },
        });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.title()).toBe("Supprimer l'élément : name");
        expect(component.text()).toBe(
            "Souhaitez-vous vraiment supprimer l'émement 'name' de la liste : 'todolist' ?",
        );
    });
});
