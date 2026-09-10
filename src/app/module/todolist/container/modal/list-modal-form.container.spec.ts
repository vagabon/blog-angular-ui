import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideTranslateService } from '@ngx-translate/core';
import { ListModalFormContainer } from './list-modal-form.container';

describe('ListModalFormContainer', () => {
    let component: ListModalFormContainer;
    let fixture: ComponentFixture<ListModalFormContainer>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ListModalFormContainer],
            providers: [provideTranslateService()],
        }).compileComponents();

        fixture = TestBed.createComponent(ListModalFormContainer);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
