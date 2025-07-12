export interface ApiResponse<T = any> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
    timestamp: string;
    stack?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
    pagination: PaginationMeta;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface PaginationQuery {
    page?: number;
    limit?: number;
}

export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}