import { ApiResponse as IApiResponse, PaginatedResponse, PaginationMeta } from '../types/common.types';
import { HttpStatus } from '../types/common.types';

export class ApiResponse {
    static success<T>(
        data: T,
        message: string = 'Operación exitosa',
        statusCode: number = HttpStatus.OK
    ): IApiResponse<T> {
        return {
            success: true,
            statusCode,
            message,
            data,
            timestamp: new Date().toISOString(),
        };
    }

    static error(
        message: string = 'Error interno del servidor',
        statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
        stack?: string
    ): IApiResponse {
        const response: IApiResponse = {
            success: false,
            statusCode,
            message,
            timestamp: new Date().toISOString(),
        };

        if (stack) {
            response.stack = stack;
        }

        return response;
    }

    static paginated<T>(
        data: T,
        pagination: PaginationMeta,
        message: string = 'Datos obtenidos exitosamente'
    ): PaginatedResponse<T> {
        return {
            success: true,
            statusCode: HttpStatus.OK,
            message,
            data,
            pagination,
            timestamp: new Date().toISOString(),
        };
    }
}