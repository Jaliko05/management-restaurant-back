import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import { ApiResponse } from '../utils/response';
import { CreateUserDto, UpdateUserDto } from '../types/user.types';
import { PaginationQuery } from '../types/common.types';
import { HttpStatus } from '../types/common.types';

interface UserParams {
    id: string;
}

interface UserQuery extends PaginationQuery { }

class UserController {
    async getAllUsers(req: Request<{}, {}, {}, UserQuery>, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page = 1, limit = 10 } = req.query;
            const result = await userService.getAllUsers(
                parseInt(page.toString()),
                parseInt(limit.toString())
            );

            res.json(
                ApiResponse.paginated(
                    result.users,
                    result.pagination,
                    'Usuarios obtenidos exitosamente'
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req: Request<UserParams>, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);

            res.json(
                ApiResponse.success(user, 'Usuario obtenido exitosamente')
            );
        } catch (error) {
            next(error);
        }
    }

    async createUser(req: Request<{}, {}, CreateUserDto>, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await userService.createUser(req.body);

            res.status(HttpStatus.CREATED).json(
                ApiResponse.success(user, 'Usuario creado exitosamente', HttpStatus.CREATED)
            );
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req: Request<UserParams, {}, UpdateUserDto>, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const user = await userService.updateUser(id, req.body);

            res.json(
                ApiResponse.success(user, 'Usuario actualizado exitosamente')
            );
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: Request<UserParams>, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const result = await userService.deleteUser(id);

            res.json(
                ApiResponse.success(result, 'Usuario eliminado exitosamente')
            );
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();