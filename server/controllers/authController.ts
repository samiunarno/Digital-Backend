import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: (process.env.JWT_EXPIRES_IN || '90d') as any,
  });
};

export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // 1) Check if username and password exist
  if (!username || !password) {
    throw new AppError('Please provide username and password', 400);
  }

  // 2) Check if user exists & password is correct
  const user = await User.findOne({ username }).select('+password') as IUser;

  if (!user || !(await user.correctPassword(password, user.password as any))) {
    throw new AppError('Incorrect username or password', 401);
  }

  // 3) If everything ok, send token to client
  const token = signToken(user._id.toString());

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
  });
});

export const register = catchAsync(async (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new AppError('Username already exists', 400);
  }

  const newUser = await User.create({
    username,
    password,
    role: role || 'admin' // Default to admin for this portfolio app
  });

  const token = signToken(newUser._id.toString());

  res.status(201).json({
    status: 'success',
    token,
    user: {
      id: newUser._id,
      username: newUser.username,
      role: newUser.role,
    },
  });
});
