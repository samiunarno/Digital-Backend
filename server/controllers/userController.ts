import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users,
  });
});

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  
  const newUser = await User.create({
    username,
    password,
    role,
  });

  res.status(201).json({
    status: 'success',
    data: newUser,
  });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { username, role, password } = req.body;
  
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }

  if (username) user.username = username;
  if (role) user.role = role;
  if (password) user.password = password;

  await user.save();

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  
  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
