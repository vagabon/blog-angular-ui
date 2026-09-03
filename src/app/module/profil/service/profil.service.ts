import { inject, Injectable, signal } from '@angular/core';
import { ID } from '@ng-vagabond-lab/ng-dsv/api';
import { BaseApiService } from '@ng-vagabond-lab/ng-dsv/base/service';
import { RouterService } from '@ng-vagabond-lab/ng-dsv/router';
import { ProfilDto } from '../dto/profil.dto';

@Injectable({
    providedIn: 'root',
})
export class ProfilService extends BaseApiService {
    readonly routerService = inject(RouterService);

    readonly profil = signal<ProfilDto | null>(null);

    getProfilCounts(userId?: ID): void {
        this.apiService.get<ProfilDto>('/todolist/list/count?userId=' + userId, (data) => {
            this.profil.update((profil) => {
                return { ...profil, ...data };
            });
        });
    }

    sendNotification() {
        this.apiService.post('/notification/send', {});
    }

    sendEmail() {
        this.apiService.post('/email/produce', {});
    }
}
