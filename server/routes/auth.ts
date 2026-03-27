import express from 'express';
import { login, register } from '../controllers/authController.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, createUserSchema } from '../validations/user.validation.js';

const router = express.Router();

router.post('/login', loginLimiter, validate(loginSchema as any), login);
router.post('/register', validate(createUserSchema as any), register);

export default router;
