import { UserDto } from '@ng-vagabond-lab/ng-dsv/module/auth';

export interface BlogDto {
    id: number;
    creationDate?: string;
    title: string;
    avatar: string;
    image: string;
    resume: string;
    description: string;
    tags: string;
    active: boolean;
    user: UserDto;
}
