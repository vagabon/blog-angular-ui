import { Component } from '@angular/core';
import { DsvCardComponent } from '@ng-vagabond-lab/ng-dsv/ds/card';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-mentions-legales',
    imports: [DsvCardComponent, TranslatePipe],
    templateUrl: './mentions-legales.component.html',
    styleUrl: './mentions-legales.component.scss',
})
export class MentionsLegalesComponent {}
