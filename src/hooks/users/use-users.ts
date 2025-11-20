"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { userService } from "@/services/user.service";
import {
  UpdateUserRolePayload,
  UserProfile,
  UsersQueryParams,
  UsersResponse,
} from "@/types/user";

export const USER_PROFILE_QUERY_KEY = ["users", "me"];
export const USERS_LIST_QUERY_KEY = ["users", "list"];

export const useUserProfile = () =>
  useQuery<UserProfile>({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: () => userService.getProfile(),
    staleTime: 5 * 60 * 1000,
  });

export const useUsers = (params: UsersQueryParams) =>
  useQuery<UsersResponse>({
    queryKey: [...USERS_LIST_QUERY_KEY, params],
    queryFn: () => userService.getUsers(params),
  });

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserRolePayload) =>
      userService.updateUserRole(payload),
    onSuccess: () => {
      toast.success("User role updated successfully");

      queryClient.invalidateQueries({ queryKey: USERS_LIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to update user role.";
      toast.error(message);
    },
  });
};

