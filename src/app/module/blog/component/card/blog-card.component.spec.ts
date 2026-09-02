import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BlogCardComponent } from './blog-card.component';

describe('BlogCardComponent', () => {
    let component: BlogCardComponent;
    let fixture: ComponentFixture<BlogCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlogCardComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(BlogCardComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
