import { ApiDto, ID } from '@ng-vagabond-lab/ng-dsv/api';
import { UserDto } from '@ng-vagabond-lab/ng-dsv/module/auth';

export interface TodolistDto {
    id: ID;
    name: string;
    avatar: string;
    description: string;
    nbItems: number;
    nbCheckedItems: number;
    creationDate: string;
    updatedDate: string;

    userCreate: UserDto;
}

export interface TodolistItemDto {
    id: ID;
    name: string;
    checked: boolean;
    orderNumber: number;
    todoDate: string;

    todolist: TodolistDto;
}

export interface TodolListIconDto extends ApiDto {
    name: string;
}
