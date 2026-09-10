import { TestBed } from '@angular/core/testing';
import { TodolistNotificationService } from './todolist-notification.service';

describe('TodolistNotificationService', () => {
    let service: TodolistNotificationService;

    beforeEach(() => {
        vi.clearAllMocks();

        TestBed.configureTestingModule({
            providers: [TodolistNotificationService],
        });

        service = TestBed.inject(TodolistNotificationService);
    });

    describe('loadListItems', () => {
        it('appelle apiService.get avec le bon endpoint', () => {
            const params = service.getParams();

            expect(params).toEqual('&category=TODOLIST&entityId=undefined');
        });
    });
});
