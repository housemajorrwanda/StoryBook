"use client";

import { useMemo } from "react";
import { LuLoader, LuRefreshCcw, LuShieldCheck } from "react-icons/lu";

import { useUserProfile } from "@/hooks/users/use-users";

export default function ProfilePage() {
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useUserProfile();

  const meta = useMemo(
    () => [
      {
        label: "Created",
        value: profile?.createdAt
          ? new Date(profile.createdAt).toLocaleString()
          : "—",
      },
      {
        label: "Last updated",
        value: profile?.updatedAt
          ? new Date(profile.updatedAt).toLocaleString()
          : "—",
      },
    ],
    [profile],
  );

  if (isLoading) {
    return (
      <section className="flex min-h-[50vh] flex-col items-center justify-center text-gray-600">
        <LuLoader className="mb-3 text-2xl animate-spin" />
        <p className="text-sm">Loading your profile...</p>
      </section>
    );
  }

  if (isError || !profile) {
    return (
      <section className="flex min-h-[50vh] flex-col items-center justify-center text-center text-gray-600">
        <p className="mb-4 text-sm">
          We couldn&apos;t load your profile right now. Please retry.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          <LuRefreshCcw className={`text-base ${isRefetching ? "animate-spin" : ""}`} />
          Retry
        </button>
      </section>
    );
  }

  const statusBadge = profile.isActive
    ? "bg-green-100 text-green-700"
    : "bg-gray-100 text-gray-600";

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500">
            Review your account details and authentication status.
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gray-900 text-lg font-semibold text-white">
                {(profile.fullName ?? profile.email ?? "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {profile.fullName ?? "Unnamed account"}
                </p>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Role
                </p>
                <p className="mt-1 text-base font-semibold text-gray-900">
                  {profile.role ?? "user"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Provider
                </p>
                <p className="mt-1 text-base font-semibold text-gray-900">
                  {profile.provider ?? "local"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Resident place
                </p>
                <p className="mt-1 text-base font-semibold text-gray-900">
                  {profile.residentPlace ?? "Not provided"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Status
                </p>
                <span
                  className={`mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusBadge}`}
                >
                  <LuShieldCheck />
                  {profile.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">
              Personal details
            </h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-500">
                  Email
                </dt>
                <dd className="text-sm font-medium text-gray-900">
                  {profile.email}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-500">
                  Google ID
                </dt>
                <dd className="text-sm font-medium text-gray-900">
                  {profile.googleId ?? "Not available"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-500">
                  Avatar
                </dt>
                <dd className="text-sm font-medium text-gray-900">
                  {profile.avatar ?? "Not available"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-500">
                  Reset token
                </dt>
                <dd className="text-sm font-medium text-gray-900">
                  {profile.resetToken ? "Issued" : "Not available"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">Account metadata</h2>
          <dl className="mt-4 space-y-4">
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="text-xs uppercase tracking-wide text-gray-500">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}