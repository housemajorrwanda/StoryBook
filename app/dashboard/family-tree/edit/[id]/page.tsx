"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  Plus,
  Eye,
  Globe,
  Lock,
  X,
  Loader2,
  Users,
} from "lucide-react";
import {
  useFamilyTree,
  useUpdateFamilyTree,
  useAddFamilyMember,
  useUpdateFamilyMember,
  useDeleteFamilyMember,
  useAddFamilyRelation,
  useDeleteFamilyRelation,
} from "@/hooks/family-tree/use-family-tree";
import {
  FamilyMember,
  Gender,
  RelationType,
  CreateFamilyMemberRequest,
  UpdateFamilyMemberRequest,
} from "@/types/family-tree";
import FamilyTreeCanvas from "@/components/family-tree/FamilyTreeCanvas";
import MemberPanel from "@/components/family-tree/MemberPanel";
import { ErrorState } from "@/components/shared";

// ── Member form ───────────────────────────────────────────────────────────────

interface MemberFormState {
  name: string;
  photoUrl: string;
  birthDate: string;
  deathDate: string;
  bio: string;
  gender: Gender | "";
  isAlive: boolean;
  testimonyId: string;
}

const EMPTY_FORM: MemberFormState = {
  name: "",
  photoUrl: "",
  birthDate: "",
  deathDate: "",
  bio: "",
  gender: "",
  isAlive: true,
  testimonyId: "",
};

function memberToForm(m: FamilyMember): MemberFormState {
  return {
    name: m.name,
    photoUrl: m.photoUrl ?? "",
    birthDate: m.birthDate ?? "",
    deathDate: m.deathDate ?? "",
    bio: m.bio ?? "",
    gender: (m.gender as Gender) ?? "",
    isAlive: m.isAlive,
    testimonyId: m.testimonyId?.toString() ?? "",
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EditFamilyTreePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const treeId = parseInt(id);
  const router = useRouter();

  const { data: tree, isLoading, error } = useFamilyTree(treeId);
  const updateTreeMutation = useUpdateFamilyTree(treeId);
  const addMemberMutation = useAddFamilyMember(treeId);
  const updateMemberMutation = useUpdateFamilyMember(treeId);
  const deleteMemberMutation = useDeleteFamilyMember(treeId);
  const addRelationMutation = useAddFamilyRelation(treeId);
  const deleteRelationMutation = useDeleteFamilyRelation(treeId);

  // UI state
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [memberForm, setMemberForm] = useState<MemberFormState>(EMPTY_FORM);

  const [showRelationForm, setShowRelationForm] = useState(false);
  const [relFrom, setRelFrom] = useState("");
  const [relTo, setRelTo] = useState("");
  const [relType, setRelType] = useState<RelationType>("parent");

  const [titleEdit, setTitleEdit] = useState("");
  const [showTitleEdit, setShowTitleEdit] = useState(false);

  // ── Member form handlers ────────────────────────────────────────────────────

  const openAddMember = () => {
    setEditingMemberId(null);
    setMemberForm(EMPTY_FORM);
    setShowMemberForm(true);
    setSelectedMember(null);
  };

  const openEditMember = (m: FamilyMember) => {
    setEditingMemberId(m.id);
    setMemberForm(memberToForm(m));
    setShowMemberForm(true);
    setSelectedMember(null);
  };

  const closeMemberForm = () => {
    setShowMemberForm(false);
    setEditingMemberId(null);
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateFamilyMemberRequest = {
      name: memberForm.name.trim(),
      photoUrl: memberForm.photoUrl.trim() || undefined,
      birthDate: memberForm.birthDate.trim() || undefined,
      deathDate: memberForm.deathDate.trim() || undefined,
      bio: memberForm.bio.trim() || undefined,
      gender: (memberForm.gender as Gender) || undefined,
      isAlive: memberForm.isAlive,
      testimonyId: memberForm.testimonyId ? parseInt(memberForm.testimonyId) : undefined,
    };

    if (editingMemberId) {
      await updateMemberMutation.mutateAsync({
        memberId: editingMemberId,
        data: payload as UpdateFamilyMemberRequest,
      });
    } else {
      await addMemberMutation.mutateAsync(payload);
    }
    closeMemberForm();
  };

  const handleDeleteMember = async (memberId: number) => {
    if (!confirm("Remove this member? Their relations will also be removed.")) return;
    await deleteMemberMutation.mutateAsync(memberId);
    setSelectedMember(null);
  };

  // ── Relation form handler ───────────────────────────────────────────────────

  const handleAddRelation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!relFrom || !relTo || relFrom === relTo) {
      toast.error("Select two different members");
      return;
    }
    await addRelationMutation.mutateAsync({
      fromMemberId: parseInt(relFrom),
      toMemberId: parseInt(relTo),
      relationType: relType,
    });
    setShowRelationForm(false);
    setRelFrom("");
    setRelTo("");
  };

  // ── Title edit ──────────────────────────────────────────────────────────────

  const openTitleEdit = () => {
    setTitleEdit(tree?.title ?? "");
    setShowTitleEdit(true);
  };

  const saveTitleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEdit.trim()) return;
    await updateTreeMutation.mutateAsync({ title: titleEdit.trim() });
    setShowTitleEdit(false);
  };

  const togglePublic = () => {
    if (!tree) return;
    updateTreeMutation.mutate({ isPublic: !tree.isPublic });
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error || !tree) {
    return (
      <div className="p-6">
        <ErrorState onRetry={() => router.refresh()} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <Link
          href="/dashboard/family-tree"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
          {showTitleEdit ? (
            <form onSubmit={saveTitleEdit} className="flex items-center gap-2">
              <input
                autoFocus
                value={titleEdit}
                onChange={(e) => setTitleEdit(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <button type="submit" className="px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg">
                Save
              </button>
              <button type="button" onClick={() => setShowTitleEdit(false)} className="p-1.5 text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={openTitleEdit}
              className="text-left text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors"
              title="Click to rename"
            >
              {tree.title}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Public toggle */}
          <button
            type="button"
            onClick={togglePublic}
            title={tree.isPublic ? "Make private" : "Make public"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              tree.isPublic
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
            }`}
          >
            {tree.isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {tree.isPublic ? "Public" : "Private"}
          </button>

          {tree.isPublic && (
            <Link
              href={`/family-tree/${tree.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </Link>
          )}
        </div>
      </div>

      {/* Action buttons — always visible at top on mobile */}
      <div className="flex flex-wrap gap-2 mb-4 lg:hidden">
        <button
          type="button"
          onClick={openAddMember}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
        {tree.members.length >= 2 && (
          <button
            type="button"
            onClick={() => setShowRelationForm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <Users className="w-4 h-4" />
            Connect
          </button>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        {/* Left: Canvas */}
        <div className="space-y-4">
          <FamilyTreeCanvas
            members={tree.members}
            relations={tree.relations}
            selectedMemberId={selectedMember?.id}
            onSelectMember={setSelectedMember}
          />

          {/* Relation actions — desktop only */}
          <div className="hidden lg:flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openAddMember}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
            {tree.members.length >= 2 && (
              <button
                type="button"
                onClick={() => setShowRelationForm(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                <Users className="w-4 h-4" />
                Connect Members
              </button>
            )}
          </div>
        </div>

        {/* Right: Members list */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Members ({tree.members.length})
          </p>
          <div className="space-y-2 max-h-[300px] lg:max-h-[440px] overflow-y-auto pr-1">
            {tree.members.map((m) => {
              const initials = m.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
              const isSelected = selectedMember?.id === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMember(isSelected ? null : m)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-gray-900 border-gray-900 text-white"
                      : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {m.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.photoUrl} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isSelected ? "text-white" : "text-gray-900"}`}>
                      {m.name}
                    </p>
                    {m.birthDate && (
                      <p className={`text-xs truncate ${isSelected ? "text-gray-300" : "text-gray-400"}`}>
                        {m.birthDate}{!m.isAlive && m.deathDate ? ` – ${m.deathDate}` : ""}
                      </p>
                    )}
                  </div>
                  {m.testimonyId && (
                    <div className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? "bg-cyan-300" : "bg-cyan-400"}`} title="Has linked testimony" />
                  )}
                </button>
              );
            })}
          </div>

          {tree.members.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              No members yet
            </div>
          )}
        </div>
      </div>

      {/* Relations list */}
      {tree.relations.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Relations ({tree.relations.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {tree.relations.map((rel) => {
              const from = tree.members.find((m) => m.id === rel.fromMemberId);
              const to = tree.members.find((m) => m.id === rel.toMemberId);
              return (
                <div
                  key={rel.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-xs text-gray-700 border border-gray-200"
                >
                  <span className="font-medium">{from?.name ?? "?"}</span>
                  <span className="text-gray-400">{rel.relationType}</span>
                  <span className="font-medium">{to?.name ?? "?"}</span>
                  <button
                    type="button"
                    onClick={() => deleteRelationMutation.mutate(rel.id)}
                    className="ml-0.5 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove relation"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Member detail panel ─────────────────────────────────────────────── */}
      {selectedMember && !showMemberForm && (
        <MemberPanel
          member={selectedMember}
          allMembers={tree.members}
          relations={tree.relations}
          onClose={() => setSelectedMember(null)}
          onEdit={() => openEditMember(selectedMember)}
          onDelete={() => handleDeleteMember(selectedMember.id)}
        />
      )}

      {/* ── Member form modal ────────────────────────────────────────────────── */}
      {showMemberForm && (
        <>
          <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px]" onClick={closeMemberForm} />
          {/* Mobile: bottom sheet; Desktop: centered modal */}
          <div className="fixed inset-x-0 bottom-0 sm:inset-x-4 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 z-40 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl sm:max-w-md sm:mx-auto overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">
                {editingMemberId ? "Edit Member" : "Add Member"}
              </h2>
              <button type="button" onClick={closeMemberForm} title="Close" aria-label="Close" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleMemberSubmit} className="px-5 py-4 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={memberForm.name}
                  onChange={(e) => setMemberForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Jean-Paul Habimana"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="member-gender" className="block text-xs font-semibold text-gray-600 mb-1">Gender</label>
                  <select
                    id="member-gender"
                    value={memberForm.gender}
                    onChange={(e) => setMemberForm((f) => ({ ...f, gender: e.target.value as Gender | "" }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">Unknown</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-xs font-semibold text-gray-600">Living</span>
                    <button
                      type="button"
                      aria-label={memberForm.isAlive ? "Mark as deceased" : "Mark as living"}
                      onClick={() => setMemberForm((f) => ({ ...f, isAlive: !f.isAlive }))}
                      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                        memberForm.isAlive ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                          memberForm.isAlive ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Birth Year/Date</label>
                  <input
                    type="text"
                    value={memberForm.birthDate}
                    onChange={(e) => setMemberForm((f) => ({ ...f, birthDate: e.target.value }))}
                    placeholder="e.g. 1952"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                {!memberForm.isAlive && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Death Year/Date</label>
                    <input
                      type="text"
                      value={memberForm.deathDate}
                      onChange={(e) => setMemberForm((f) => ({ ...f, deathDate: e.target.value }))}
                      placeholder="e.g. 2010"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={memberForm.photoUrl}
                  onChange={(e) => setMemberForm((f) => ({ ...f, photoUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Bio / Notes</label>
                <textarea
                  value={memberForm.bio}
                  onChange={(e) => setMemberForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Brief biography or notes about this person"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Link Testimony (ID)
                </label>
                <input
                  type="number"
                  value={memberForm.testimonyId}
                  onChange={(e) => setMemberForm((f) => ({ ...f, testimonyId: e.target.value }))}
                  placeholder="Testimony ID (optional)"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={!memberForm.name.trim() || addMemberMutation.isPending || updateMemberMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {(addMemberMutation.isPending || updateMemberMutation.isPending) ? "Saving…" : editingMemberId ? "Save Changes" : "Add Member"}
                </button>
                <button
                  type="button"
                  onClick={closeMemberForm}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── Relation form modal ──────────────────────────────────────────────── */}
      {showRelationForm && (
        <>
          <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px]" onClick={() => setShowRelationForm(false)} />
          <div className="fixed inset-x-0 bottom-0 sm:inset-x-4 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 z-40 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl sm:max-w-sm sm:mx-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Connect Members</h2>
              <button type="button" onClick={() => setShowRelationForm(false)} title="Close" aria-label="Close" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRelation} className="space-y-4">
              <div>
                <label htmlFor="rel-from" className="block text-xs font-semibold text-gray-600 mb-1">From Member</label>
                <select
                  id="rel-from"
                  value={relFrom}
                  onChange={(e) => setRelFrom(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">Select member…</option>
                  {tree.members.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="rel-type" className="block text-xs font-semibold text-gray-600 mb-1">Relation</label>
                <select
                  id="rel-type"
                  value={relType}
                  onChange={(e) => setRelType(e.target.value as RelationType)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="parent">is parent of →</option>
                  <option value="child">is child of →</option>
                  <option value="spouse">is spouse of →</option>
                  <option value="sibling">is sibling of →</option>
                </select>
              </div>

              <div>
                <label htmlFor="rel-to" className="block text-xs font-semibold text-gray-600 mb-1">To Member</label>
                <select
                  id="rel-to"
                  value={relTo}
                  onChange={(e) => setRelTo(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">Select member…</option>
                  {tree.members
                    .filter((m) => m.id.toString() !== relFrom)
                    .map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={!relFrom || !relTo || addRelationMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {addRelationMutation.isPending ? "Adding…" : "Add Connection"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRelationForm(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
