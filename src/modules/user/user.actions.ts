'use server';

import { revalidatePath } from 'next/cache';

import { UserService } from './user.service';

export const getCurrentUser = async () => {
  const userService = new UserService();
  return await userService.getCurrentUser();
};

export const updateUserProfile = async (formData: FormData) => {
  const email = formData.get('email') as string;

  const userService = new UserService();
  const currentUser = await userService.getCurrentUser();

  if (!currentUser) {
    throw new Error('User not found');
  }

  const updatedUser = await userService.updateUser(currentUser.id, { email });

  if (updatedUser) {
    revalidatePath('/profile');
  }

  return updatedUser;
};
