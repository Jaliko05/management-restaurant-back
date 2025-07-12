
import { PaginationMeta } from './common.types';
import { Role } from '../../generated/prisma';


export interface CreateUserDto {
    email: string;
    password: string;
    name?: string;
    role?: Role;
}

export interface UpdateUserDto {
    email?: string;
    name?: string;
    role?: Role;
}

export interface UserResponse {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

export interface UsersWithPagination {
    users: UserResponse[];
    pagination: PaginationMeta;
}