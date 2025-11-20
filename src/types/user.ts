export interface UserProfile {
  id: number;
  email: string;
  fullName: string | null;
  residentPlace: string | null;
  isActive: boolean;
  role: string | null;
  provider?: string | null;
  avatar?: string | null;
  googleId?: string | null;
  resetToken?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserRolePayload {
  userId: number;
  role: string;
}

export interface UsersQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
}

export interface UsersResponse {
  data: UserProfile[];
  total: number;
  skip: number;
  limit: number;
}

