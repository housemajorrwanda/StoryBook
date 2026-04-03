"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Users, TreePine, Calendar, Globe } from "lucide-react";
import { usePublicFamilyTree } from "@/hooks/family-tree/use-family-tree";
import { FamilyMember } from "@/types/family-tree";
import FamilyTreeCanvas from "@/components/family-tree/FamilyTreeCanvas";
import MemberPanel from "@/components/family-tree/MemberPanel";

export default function PublicFamilyTreePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const treeId = parseInt(id);

  const { data: tree, isLoading, error } = usePublicFamilyTree(treeId);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-gray-700 animate-spin" />
          <p className="text-sm text-gray-500">Loading family tree…</p>
        </div>
      </div>
    );
  }

  if (error || !tree) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-sm px-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <TreePine className="w-7 h-7 text-gray-300" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Tree not found</h2>
          <p className="text-sm text-gray-500 mb-6">
            This family tree doesn&apos;t exist or is private.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const memberCount = tree.members.length;
  const generationCount = (() => {
    // rough generation estimate: max depth in parent relations
    const childrenOf = new Map<number, number[]>();
    for (const rel of tree.relations) {
      if (rel.relationType === "parent") {
        const arr = childrenOf.get(rel.fromMemberId) ?? [];
        arr.push(rel.toMemberId);
        childrenOf.set(rel.fromMemberId, arr);
      }
    }
    let maxDepth = 1;
    const visited = new Set<number>();
    const dfs = (id: number, depth: number) => {
      if (visited.has(id)) return;
      visited.add(id);
      maxDepth = Math.max(maxDepth, depth);
      for (const child of childrenOf.get(id) ?? []) dfs(child, depth + 1);
    };
    const hasParent = new Set(tree.relations.filter((r) => r.relationType === "parent").map((r) => r.toMemberId));
    tree.members.filter((m) => !hasParent.has(m.id)).forEach((m) => dfs(m.id, 1));
    return maxDepth;
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            iHame
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400">
            <Globe className="w-3.5 h-3.5" />
            Public Family Tree
          </span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Tree header */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
              <TreePine className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{tree.title}</h1>
              {tree.user?.fullName && (
                <p className="text-sm text-gray-500 mt-0.5">
                  Created by {tree.user.fullName}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="sm:ml-auto flex items-center gap-4">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{memberCount}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Users className="w-3 h-3" /> Members
              </p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{generationCount}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Generations
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {tree.description && (
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
            {tree.description}
          </p>
        )}

        {/* Canvas */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Family Tree — click a member to learn more
          </p>
          <FamilyTreeCanvas
            members={tree.members}
            relations={tree.relations}
            selectedMemberId={selectedMember?.id}
            onSelectMember={(m) => setSelectedMember(m.id === selectedMember?.id ? null : m)}
            readOnly
          />
        </div>

        {/* Members grid */}
        {memberCount > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              All Members
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {tree.members.map((m) => {
                const initials = m.name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase();
                const isSelected = selectedMember?.id === m.id;

                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMember(isSelected ? null : m)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-gray-900 border-gray-900"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : m.gender === "male"
                          ? "bg-blue-100 text-blue-600"
                          : m.gender === "female"
                          ? "bg-pink-100 text-pink-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {m.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.photoUrl} alt={m.name} className="w-10 h-10 rounded-xl object-cover" />
                      ) : initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isSelected ? "text-white" : "text-gray-900"}`}>
                        {m.name}
                      </p>
                      <p className={`text-xs truncate ${isSelected ? "text-gray-300" : "text-gray-400"}`}>
                        {m.birthDate
                          ? `${m.birthDate}${!m.isAlive && m.deathDate ? ` – ${m.deathDate}` : m.isAlive ? "" : " – ?"}`
                          : m.isAlive ? "Living" : "Deceased"}
                      </p>
                    </div>
                    {m.testimonyId && (
                      <div className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? "bg-cyan-300" : "bg-cyan-400"}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Member detail panel */}
      {selectedMember && (
        <MemberPanel
          member={selectedMember}
          allMembers={tree.members}
          relations={tree.relations}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}
