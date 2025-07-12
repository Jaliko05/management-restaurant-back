import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { CreateUserDto, UpdateUserDto, UserResponse, UsersWithPagination } from '../types/user.types';
import { PaginationMeta } from '../types/common.types';
import { HttpStatus } from '../types/common.types';
import bcrypt from 'bcryptjs';

class UserService {
    async getAllUsers(page: number = 1, limit: number = 10): Promise<UsersWithPagination> {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma.user.count(),
        ]);

        const pagination: PaginationMeta = {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        };

        return {
            users: users as UserResponse[],
            pagination,
        };
    }

    async getUserById(id: string): Promise<UserResponse> {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new AppError('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }

        return user as UserResponse;
    }

    async createUser(userData: CreateUserDto): Promise<UserResponse> {
        const { email, password, name, role } = userData;

        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new AppError('El usuario ya existe', HttpStatus.BAD_REQUEST);
        }

        // Hashear password
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user as UserResponse;
    }

    async updateUser(id: string, userData: UpdateUserDto): Promise<UserResponse> {
        const { email, name, role } = userData;

        // Verificar si el usuario existe
        await this.getUserById(id);

        const user = await prisma.user.update({
            where: { id },
            data: {
                email,
                name,
                role,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user as UserResponse;
    }

    async deleteUser(id: string): Promise<{ message: string }> {
        // Verificar si el usuario existe
        await this.getUserById(id);

        await prisma.user.delete({
            where: { id },
        });

        return { message: 'Usuario eliminado correctamente' };
    }
}

export default new UserService();