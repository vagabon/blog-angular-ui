import { Component, computed, inject } from '@angular/core';
import { DsvHeaderComponent } from '@ng-vagabond-lab/ng-dsv/ds/header';
import { EnvironmentDto, EnvironmentService } from '@ng-vagabond-lab/ng-dsv/environment';
import { AuthComponent } from '@ng-vagabond-lab/ng-dsv/modules/auth';
import { MemberService } from 'app/module/member/service/member.service';

@Component({
  selector: 'app-header',
  imports: [DsvHeaderComponent, AuthComponent],
  templateUrl: './header.container.html',
})
export class HeaderContainer {
  memberService = inject(MemberService);
  environmentService = inject(EnvironmentService);

  title = computed(() => this.environmentService.env()?.['APP_NAME' as keyof EnvironmentDto]!);

}
