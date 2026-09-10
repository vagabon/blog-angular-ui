import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodolistIconComponent } from './todolist-icon.component';

describe('TodolistIconComponent', () => {
    let component: TodolistIconComponent;
    let fixture: ComponentFixture<TodolistIconComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TodolistIconComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TodolistIconComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
