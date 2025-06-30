export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  id: string;
  email: string;
}

export interface UpdateUserData {
  email?: string;
}
