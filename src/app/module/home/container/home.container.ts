import { Component, effect, inject } from '@angular/core';
import { DateFormatPipe } from '@ng-vagabond-lab/ng-dsv/date';
import { NewsCardResumeComponent } from '@ng-vagabond-lab/ng-dsv/module/news';
import { RouterInternalPipe } from '@ng-vagabond-lab/ng-dsv/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HomeService } from '../service/home.service';

@Component({
    selector: 'app-home',
    imports: [NewsCardResumeComponent, RouterInternalPipe, TranslatePipe, DateFormatPipe],
    styleUrl: './home.container.scss',
    templateUrl: './home.container.html',
})
export class HomeContainer {
    protected readonly homeService = inject(HomeService);

    constructor() {
        effect(() => {
            this.homeService.getNews();
        });
    }
}
