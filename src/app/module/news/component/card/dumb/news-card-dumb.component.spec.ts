import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsCardDumbComponent } from './news-card-dumb.component';


describe('NewsCardDumbComponent', () => {
  let component: NewsCardDumbComponent;
  let fixture: ComponentFixture<NewsCardDumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsCardDumbComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(NewsCardDumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
