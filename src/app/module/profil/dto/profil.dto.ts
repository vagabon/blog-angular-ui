import { UserDto } from '@ng-vagabond-lab/ng-dsv/module/auth';

export interface ProfilDto {
    user: UserDto;
    nbTodolist: number;
    nbItems: number;
    nbItemsChecked: number;
}
