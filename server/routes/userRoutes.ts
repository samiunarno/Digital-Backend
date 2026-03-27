import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema, updateUserSchema, deleteUserSchema } from '../validations/user.validation.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);
router.use(restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(validate(createUserSchema as any), userController.createUser);

router
  .route('/:id')
  .patch(validate(updateUserSchema as any), userController.updateUser)
  .delete(validate(deleteUserSchema as any), userController.deleteUser);

export default router;
