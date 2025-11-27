"use client";

import { useEffect, useMemo, useState } from "react";
import { LuLoader, LuSearch } from "react-icons/lu";

import { ConfirmModal, Pagination } from "@/components/shared";
import { useUsers, useUpdateUserRole } from "@/hooks/users/use-users";
import type { UserProfile } from "@/types/user";
import toast from "react-hot-toast";

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
];

export default function UsersManagementPage() {
  const [pagination, setPagination] = useState({ skip: 0, limit: 15 });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const { data: users, isLoading, isError } = useUsers({
    skip: pagination.skip,
    limit: pagination.limit,
    search: debouncedSearch || undefined,
  });
  const updateRole = useUpdateUserRole();

  const { rows, total, skip: currentSkip, limit: currentLimit } = useMemo<{
    rows: UserProfile[];
    total: number;
    skip: number;
    limit: number;
  }>(
    () => ({
      rows: users?.data ?? [],
      total: users?.total ?? 0,
      skip: users?.skip ?? pagination.skip,
      limit: users?.limit ?? pagination.limit,
    }),
    [users, pagination.skip, pagination.limit],
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("user");

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, skip: (page - 1) * prev.limit }));
  };

  const handleSearchInput = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, skip: 0 }));
  };

  const openRoleModal = (user: UserProfile) => {
    setPendingUser(user);
    setSelectedRole(user.role ?? "user");
    setDialogOpen(true);
  };

  const closeRoleModal = () => {
    setDialogOpen(false);
    setPendingUser(null);
  };

  const handleConfirmRole = async () => {
    if (!pendingUser) return;
    try {
      await updateRole.mutateAsync({
        userId: pendingUser.id,
        role: selectedRole,
      });
      closeRoleModal();
    } catch (error: unknown) {
      toast.error((error as { message?: string })?.message || "Failed to update user role");
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500">
          Review all registered accounts and adjust their permissions.
        </p>
      </header>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-4 py-3">
          <div className="relative w-full max-w-sm">
            <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => handleSearchInput(event.target.value)}
              placeholder="Search by email or name..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-sm focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 placeholder:text-gray-500 text-gray-600 cursor-pointer"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <LuLoader className="mr-2 h-5 w-5 animate-spin" />
            Fetching users...
          </div>
        ) : isError ? (
          <div className="py-12 text-center text-sm text-red-600">
            Unable to load users. Please try again later.
          </div>
        ) : rows.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 w-12 text-center">#</th>
                <th className="px-4 py-3">User Email</th>
                <th className="px-4 py-3">Full name</th>
                <th className="px-4 py-3">Resident Place</th>
                <th className="px-4 py-3">Account Status</th>
                <th className="px-4 py-3">Account Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((user, index) => (
                <tr key={user.id} className="text-gray-700">
                  <td className="px-4 py-3 text-center text-gray-500">
                    {currentSkip + index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      Created {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {user.fullName ?? <span className="text-gray-400">Not available</span>}
                  </td>
                  <td className="px-4 py-3">
                    {user.residentPlace ?? <span className="text-gray-400">Not available</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${
                        user.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-700">
                        {user.role ?? "user"}
                      </span>
                      <button
                        type="button"
                        onClick={() => openRoleModal(user)}
                        className="text-xs font-semibold text-gray-900 underline underline-offset-2 hover:text-gray-600 cursor-pointer"
                      >
                        Change role
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center text-sm text-gray-500">
            No users found.
          </div>
        )}
        <Pagination
          total={total}
          limit={currentLimit}
          skip={currentSkip}
          onPageChange={handlePageChange}
        />
      </div>
      <ConfirmModal
        isOpen={dialogOpen}
        title="Change user role"
        description={
          pendingUser
            ? `Select a new role for ${pendingUser.email || "this user"}.`
            : undefined
        }
        confirmLabel="Confirm change"
        isConfirming={updateRole.isPending}
        onClose={closeRoleModal}
        onConfirm={handleConfirmRole}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose the permission level you want to assign.
          </p>
          <div className="space-y-2">
            {roleOptions.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium ${
                  selectedRole === option.value
                    ? "border-gray-900 bg-gray-50 text-gray-900"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                <span>{option.label}</span>
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={selectedRole === option.value}
                  onChange={(event) => setSelectedRole(event.target.value)}
                  className="accent-gray-900"
                />
              </label>
            ))}
          </div>
        </div>
      </ConfirmModal>
    </section>
  );
}
