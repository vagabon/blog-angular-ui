import { inject, Injectable, signal } from '@angular/core';
import { ApiService, ID } from '@ng-vagabond-lab/ng-dsv/api';
import { MemberDto } from '../dto/member.dto';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private readonly apiService = inject(ApiService);

  member = signal<MemberDto | null>(null);

  initMember(userId: ID) {
    userId &&
      this.apiService.get<MemberDto>('member/user/' + userId, (data) => {
        if (data.id == null) {
          this.apiService.post<MemberDto>(
            'member/forUser',
            { user: { id: userId } },
            (data) => {
              this.member.set(data);
            },
          );
        } else {
          this.member.set(data);
        }
      });
  }
}
