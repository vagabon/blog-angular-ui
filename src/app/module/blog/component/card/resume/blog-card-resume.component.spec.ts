import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BlogCardResumeComponent } from './blog-card-resume.component';

describe('BlogCardResumeComponent', () => {
    let component: BlogCardResumeComponent;
    let fixture: ComponentFixture<BlogCardResumeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlogCardResumeComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(BlogCardResumeComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
