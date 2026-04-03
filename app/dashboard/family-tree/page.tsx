"use client";

import Link from "next/link";
import { Plus, Users, TreePine, Globe, Lock, Trash2, Edit, Eye } from "lucide-react";
import {
  PageHeader,
  EmptyState,
  ErrorState,
  TableLoadingState,
} from "@/components/shared";
import {
  useMyFamilyTrees,
  useDeleteFamilyTree,
} from "@/hooks/family-tree/use-family-tree";
import { FamilyTree } from "@/types/family-tree";

export default function FamilyTreeDashboard() {
  const { data: trees, isLoading, error } = useMyFamilyTrees();
  const deleteMutation = useDeleteFamilyTree();

  const handleDelete = (tree: FamilyTree) => {
    if (confirm(`Delete "${tree.title}"? This cannot be undone.`)) {
      deleteMutation.mutate(tree.id);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-8 bg-gray-100 rounded-lg w-48 mb-1 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded-lg w-72 mb-8 animate-pulse" />
        <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
          <TableLoadingState cols={5} rows={4} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Family Trees"
        description="Build and manage family trees linked to testimonies"
        actions={[
          {
            label: "New Tree",
            href: "/dashboard/family-tree/create",
            icon: <Plus className="w-4 h-4" />,
          },
        ]}
      />

      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                  Tree
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                  Visibility
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                  Members
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                  Created
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {(trees ?? []).map((tree) => (
                <tr
                  key={tree.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <TreePine className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 leading-tight">
                          {tree.title}
                        </p>
                        {tree.description && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-xs">
                            {tree.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {tree.isPublic ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <Globe className="w-3 h-3" />
                        Public
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        <Lock className="w-3 h-3" />
                        Private
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-gray-700 text-sm font-medium">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      {tree._count?.members ?? tree.members?.length ?? 0}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(tree.createdAt)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      {tree.isPublic && (
                        <Link
                          href={`/family-tree/${tree.id}`}
                          title="View public page"
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                      <Link
                        href={`/dashboard/family-tree/edit/${tree.id}`}
                        title="Edit tree"
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        title="Delete tree"
                        onClick={() => handleDelete(tree)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!trees || trees.length === 0) && (
          <EmptyState
            variant="table"
            title="No family trees yet"
            subtitle="Create your first family tree to get started."
            action={{
              label: "New Tree",
              href: "/dashboard/family-tree/create",
              icon: <Plus className="w-4 h-4" />,
            }}
          />
        )}
      </div>
    </div>
  );
}
