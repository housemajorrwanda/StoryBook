"use client";

import Link from "next/link";
import { Plus, Users, TreePine, Globe, Lock, Trash2, Edit, Eye, ChevronRight } from "lucide-react";
import { useMyFamilyTrees, useDeleteFamilyTree } from "@/hooks/family-tree/use-family-tree";
import { FamilyTree } from "@/types/family-tree";
import PageLayout from "@/layout/PageLayout";
import { isAuthenticated } from "@/lib/decodeToken";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MyFamilyTreesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { data: trees, isLoading, error } = useMyFamilyTrees();
  const deleteMutation = useDeleteFamilyTree();

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  const handleDelete = (tree: FamilyTree) => {
    if (confirm(`Delete "${tree.title}"? This cannot be undone.`)) {
      deleteMutation.mutate(tree.id);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  if (!mounted) return null;

  return (
    <PageLayout variant="default">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Family Trees</h1>
            <p className="text-sm text-gray-500 mt-1">
              Build and share your family history, linked to testimonies.
            </p>
          </div>
          <Link
            href="/family-tree/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Tree</span>
          </Link>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16 text-gray-500">
            <p>Failed to load your trees.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 text-sm text-gray-900 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && (!trees || trees.length === 0) && (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
            <TreePine className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 mb-1">No family trees yet</h2>
            <p className="text-sm text-gray-500 mb-6">
              Create your first tree to start mapping your family history.
            </p>
            <Link
              href="/family-tree/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Family Tree
            </Link>
          </div>
        )}

        {/* List */}
        {!isLoading && trees && trees.length > 0 && (
          <div className="space-y-3">
            {trees.map((tree) => (
              <div
                key={tree.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:border-gray-200 hover:shadow-sm transition-all"
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <TreePine className="w-5 h-5 text-emerald-600" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 truncate">{tree.title}</p>
                    {tree.isPublic ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <Globe className="w-2.5 h-2.5" /> Public
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-500 border border-gray-200">
                        <Lock className="w-2.5 h-2.5" /> Private
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {tree._count?.members ?? tree.members?.length ?? 0} members
                    </span>
                    <span>{formatDate(tree.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
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
                    href={`/family-tree/edit/${tree.id}`}
                    title="Edit tree"
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    title="Delete tree"
                    onClick={() => handleDelete(tree)}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/family-tree/edit/${tree.id}`}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
