import axiosInstance from "@/config/axiosInstance";
import {
  UpdateUserRolePayload,
  UserProfile,
  UsersQueryParams,
  UsersResponse,
} from "@/types/user";

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  },

  getUsers: async (params: UsersQueryParams = {}): Promise<UsersResponse> => {
    const { skip = 0, limit = 20, search } = params;
    const response = await axiosInstance.get("/users", {
      params: {
        skip,
        limit,
        ...(search ? { search } : {}),
      },
    });

    const payload = response.data;

    if (Array.isArray(payload)) {
      return {
        data: payload,
        total: payload.length,
        skip,
        limit,
      };
    }

    return {
      data: payload?.data ?? [],
      total: payload?.total ?? payload?.data?.length ?? 0,
      skip: payload?.skip ?? skip,
      limit: payload?.limit ?? limit,
    };
  },

  updateUserRole: async ({
    userId,
    role,
  }: UpdateUserRolePayload): Promise<UserProfile> => {
    const response = await axiosInstance.patch(`/users/${userId}/role`, {
      role,
    });
    return response.data;
  },
};

