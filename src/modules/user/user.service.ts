import { createClient } from '@/services/supabase/server';

import type { CreateUserData, UpdateUserData, User } from './user.types';

export class UserService {
  private supabase = createClient();

  async getCurrentUser(): Promise<User | null> {
    const supabase = await this.supabase;

    // Получаем текущего пользователя из auth
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) return null;

    // Получаем данные из таблицы users
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  }

  async createUser(userData: CreateUserData): Promise<User | null> {
    const supabase = await this.supabase;

    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return data;
  }

  async updateUser(
    userId: string,
    updateData: UpdateUserData,
  ): Promise<User | null> {
    const supabase = await this.supabase;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return null;
    }

    return data;
  }

  async getUserById(userId: string): Promise<User | null> {
    const supabase = await this.supabase;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user by id:', error);
      return null;
    }

    return data;
  }
}
