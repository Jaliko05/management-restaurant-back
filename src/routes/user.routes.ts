import { Router } from 'express';
import userController from '../controllers/user.controller';
import {
    validateCreateUser,
    validateUpdateUser,
    validateUserId,
    validatePagination,
    handleValidationErrors,
} from '../middleware/validation.middleware';

const router: Router = Router();

router
    .route('/')
    .get(validatePagination, handleValidationErrors, userController.getAllUsers)
    .post(validateCreateUser, handleValidationErrors, userController.createUser);

router
    .route('/:id')
    .get(validateUserId, handleValidationErrors, userController.getUserById)
    .put(validateUpdateUser, handleValidationErrors, userController.updateUser)
    .delete(validateUserId, handleValidationErrors, userController.deleteUser);

export default router;