"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useCreateFamilyTree } from "@/hooks/family-tree/use-family-tree";

export default function CreateFamilyTreePage() {
  const router = useRouter();
  const createMutation = useCreateFamilyTree();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const tree = await createMutation.mutateAsync({ title: title.trim(), description: description.trim() || undefined, isPublic });
    router.push(`/dashboard/family-tree/edit/${tree.id}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link
        href="/dashboard/family-tree"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Family Trees
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Family Tree</h1>
      <p className="text-sm text-gray-500 mb-8">
        Start by giving your tree a name. You can add members and connections after.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Tree Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Habimana Family Tree"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short description of this family tree (optional)"
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50">
          <div>
            <p className="text-sm font-semibold text-gray-800">Make this tree public</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Public trees can be viewed by anyone with the link
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic((p) => !p)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
              isPublic ? "bg-gray-900" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                isPublic ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <button
          type="submit"
          disabled={!title.trim() || createMutation.isPending}
          className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createMutation.isPending ? "Creating…" : "Create & Add Members →"}
        </button>
      </form>
    </div>
  );
}
