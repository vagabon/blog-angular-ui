import { ApiDto } from '@ng-vagabond-lab/ng-dsv/api';
import { UserDto } from '@ng-vagabond-lab/ng-dsv/modules/auth';

export interface MemberDto extends ApiDto {
  user?: UserDto;
  endPlan?: string;
}
