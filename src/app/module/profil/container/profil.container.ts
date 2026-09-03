import { Component, computed, effect, inject, signal } from '@angular/core';
import { BaseRouteContainer } from '@ng-vagabond-lab/ng-dsv/base';
import { DateFormatPipe } from '@ng-vagabond-lab/ng-dsv/date';
import { DsvCardComponent } from '@ng-vagabond-lab/ng-dsv/ds/card';
import { UserDto } from '@ng-vagabond-lab/ng-dsv/module/auth';
import { ProfilService } from '../service/profil.service';
import { DsvButtonComponent } from '@ng-vagabond-lab/ng-dsv/ds/button';

@Component({
    selector: 'app-profil',
    imports: [DsvCardComponent, DateFormatPipe, DsvButtonComponent],
    templateUrl: './profil.container.html',
    styleUrl: './profil.container.scss',
})
export class ProfilContainer extends BaseRouteContainer {
    readonly profilService = inject(ProfilService);

    readonly user = signal<UserDto | null>(null);

    readonly isAdmin = computed<boolean>(() => this.authService.hasRole('ADMIN'));

    constructor() {
        super();
        effect(() => {
            if (this.authService.userConnected()) {
                this.user.set(this.authService.userConnected());
                this.profilService.getProfilCounts(this.authService.userConnected()?.id);
            }
        });
    }
}
