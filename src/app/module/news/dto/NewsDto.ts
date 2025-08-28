import { ApiDto } from "@ng-vagabond-lab/ng-dsv/api";
import { UserDto } from "@ng-vagabond-lab/ng-dsv/modules/auth";

export interface NewsDto extends ApiDto {
  title?: string;
  avatar?: string;
  image?: string;
  resume?: string;
  description?: string;
  user?: UserDto;
  search?: string;
  tags?: string;
}
