import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodolistItemComponent } from './todolist-item.component';

describe('TodolistItemComponent', () => {
    let component: TodolistItemComponent;
    let fixture: ComponentFixture<TodolistItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TodolistItemComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TodolistItemComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', async () => {
        fixture.componentRef.setInput('todolistItem', {
            id: 42,
            name: 'name',
            avatar: 'avatar',
            todolist: { name: 'todolist' },
        });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component).toBeTruthy();
    });
});
