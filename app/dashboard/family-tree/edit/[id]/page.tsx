"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ChevronLeft, Plus, Eye, Globe, Lock, X, Loader2, Users } from "lucide-react";
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
  RelationType,
  CreateFamilyMemberRequest,
  UpdateFamilyMemberRequest,
} from "@/types/family-tree";
import FamilyTreeCanvas from "@/components/family-tree/FamilyTreeCanvas";
import MemberPanel from "@/components/family-tree/MemberPanel";
import AddMemberModal, { MemberFormData, EMPTY_MEMBER_FORM } from "@/components/family-tree/AddMemberModal";
import { RWANDA_LOCATIONS } from "@/lib/rwanda-locations";
import { ErrorState } from "@/components/shared";

function findProvince(district: string): string {
  for (const [prov, dists] of Object.entries(RWANDA_LOCATIONS)) {
    if (district in dists) return prov;
  }
  return "";
}

function memberToForm(m: FamilyMember): MemberFormData {
  const district = m.district ?? "";
  return {
    name: m.name,
    photoUrl: m.photoUrl ?? "",
    photoUrls: m.photoUrls ?? [],
    birthDate: m.birthDate ?? "",
    deathDate: m.deathDate ?? "",
    bio: m.bio ?? "",
    gender: (m.gender as MemberFormData["gender"]) ?? "",
    isAlive: m.isAlive,
    testimonyId: m.testimonyId?.toString() ?? "",
    province: district ? findProvince(district) : "",
    district,
    sector: m.sector ?? "",
    cell: m.cell ?? "",
    relativeOfId: "",
    relativeOfType: "parent",
  };
}

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

  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [editingFormData, setEditingFormData] = useState<MemberFormData | undefined>(undefined);

  const [showRelationForm, setShowRelationForm] = useState(false);
  const [relFrom, setRelFrom] = useState("");
  const [relTo, setRelTo] = useState("");
  const [relType, setRelType] = useState<RelationType>("parent");

  const [titleEdit, setTitleEdit] = useState("");
  const [showTitleEdit, setShowTitleEdit] = useState(false);

  const openAddMember = () => {
    setEditingMemberId(null);
    setEditingFormData(undefined);
    setShowMemberForm(true);
    setSelectedMember(null);
  };

  const openEditMember = (m: FamilyMember) => {
    setEditingMemberId(m.id);
    setEditingFormData(memberToForm(m));
    setShowMemberForm(true);
    setSelectedMember(null);
  };

  const closeMemberForm = () => {
    setShowMemberForm(false);
    setEditingMemberId(null);
    setEditingFormData(undefined);
  };

  const handleMemberSubmit = async (
    payload: CreateFamilyMemberRequest,
    relativeOf?: { memberId: number; relationType: RelationType },
  ) => {
    try {
      if (editingMemberId) {
        await updateMemberMutation.mutateAsync({ memberId: editingMemberId, data: payload as UpdateFamilyMemberRequest });
      } else {
        const newMember = await addMemberMutation.mutateAsync(payload);
        if (relativeOf) {
          try {
            await addRelationMutation.mutateAsync({
              fromMemberId: newMember.id,
              toMemberId: relativeOf.memberId,
              relationType: relativeOf.relationType,
            });
          } catch {
            toast.error("Member saved, but relation could not be created. You can add it manually.");
          }
        }
      }
      closeMemberForm();
    } catch {
      toast.error("Failed to save member. Please try again.");
    }
  };

  const handleDeleteMember = async (memberId: number) => {
    if (!confirm("Remove this member? Their relations will also be removed.")) return;
    try {
      await deleteMemberMutation.mutateAsync(memberId);
      setSelectedMember(null);
    } catch {
      toast.error("Failed to remove member. Please try again.");
    }
  };

  const handleAddRelation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!relFrom || !relTo || relFrom === relTo) { toast.error("Select two different members"); return; }
    try {
      await addRelationMutation.mutateAsync({ fromMemberId: parseInt(relFrom), toMemberId: parseInt(relTo), relationType: relType });
      setShowRelationForm(false);
      setRelFrom(""); setRelTo("");
    } catch {
      toast.error("Failed to add connection. Please try again.");
    }
  };

  const saveTitleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEdit.trim()) return;
    try {
      await updateTreeMutation.mutateAsync({ title: titleEdit.trim() });
      setShowTitleEdit(false);
    } catch {
      toast.error("Failed to rename tree. Please try again.");
    }
  };

  const togglePublic = () => {
    if (!tree) return;
    updateTreeMutation.mutate({ isPublic: !tree.isPublic });
  };

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

  const isSavingMember = addMemberMutation.isPending || updateMemberMutation.isPending;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <Link href="/dashboard/family-tree"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
          {showTitleEdit ? (
            <form onSubmit={saveTitleEdit} className="flex items-center gap-2">
              <input autoFocus value={titleEdit} onChange={(e) => setTitleEdit(e.target.value)}
                title="Tree title" placeholder="Family tree title"
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900" />
              <button type="submit" className="px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg">Save</button>
              <button type="button" onClick={() => setShowTitleEdit(false)} title="Cancel" aria-label="Cancel" className="p-1.5 text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button type="button" onClick={() => { setTitleEdit(tree.title); setShowTitleEdit(true); }}
              className="text-left text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors" title="Click to rename">
              {tree.title}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button type="button" onClick={togglePublic}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              tree.isPublic ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
            }`}>
            {tree.isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {tree.isPublic ? "Public" : "Private"}
          </button>
          {tree.isPublic && (
            <Link href={`/family-tree/${tree.id}`} target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
              <Eye className="w-3.5 h-3.5" /> Preview
            </Link>
          )}
        </div>
      </div>

      {/* Mobile action buttons */}
      <div className="flex flex-wrap gap-2 mb-4 lg:hidden">
        <button type="button" onClick={openAddMember}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4" /> Add Member
        </button>
        {tree.members.length >= 2 && (
          <button type="button" onClick={() => setShowRelationForm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">
            <Users className="w-4 h-4" /> Connect
          </button>
        )}
      </div>

      {/* Canvas + Members */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        <div className="space-y-4">
          <FamilyTreeCanvas
            members={tree.members}
            relations={tree.relations}
            selectedMemberId={selectedMember?.id}
            onSelectMember={setSelectedMember}
          />
          <div className="hidden lg:flex flex-wrap gap-2">
            <button type="button" onClick={openAddMember}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
              <Plus className="w-4 h-4" /> Add Member
            </button>
            {tree.members.length >= 2 && (
              <button type="button" onClick={() => setShowRelationForm(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">
                <Users className="w-4 h-4" /> Connect Members
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Members ({tree.members.length})
          </p>
          <div className="space-y-2 max-h-[180px] sm:max-h-[300px] lg:max-h-[440px] overflow-y-auto pr-1">
            {tree.members.map((m) => {
              const initials = m.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
              const isSelected = selectedMember?.id === m.id;
              return (
                <button key={m.id} type="button" onClick={() => setSelectedMember(isSelected ? null : m)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                    isSelected ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  }`}>
                    {m.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.photoUrl} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isSelected ? "text-white" : "text-gray-900"}`}>{m.name}</p>
                    {m.birthDate && (
                      <p className={`text-xs truncate ${isSelected ? "text-gray-300" : "text-gray-400"}`}>
                        {m.birthDate}{!m.isAlive && m.deathDate ? ` – ${m.deathDate}` : ""}
                      </p>
                    )}
                  </div>
                  {m.testimonyId && <div className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? "bg-cyan-300" : "bg-cyan-400"}`} title="Has linked testimony" />}
                </button>
              );
            })}
          </div>
          {tree.members.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">No members yet</div>}
        </div>
      </div>

      {/* Relations list */}
      {tree.relations.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Relations ({tree.relations.length})</p>
          <div className="flex flex-wrap gap-2">
            {tree.relations.map((rel) => {
              const from = tree.members.find((m) => m.id === rel.fromMemberId);
              const to = tree.members.find((m) => m.id === rel.toMemberId);
              return (
                <div key={rel.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-xs text-gray-700 border border-gray-200">
                  <span className="font-medium">{from?.name ?? "?"}</span>
                  <span className="text-gray-400">{rel.relationType}</span>
                  <span className="font-medium">{to?.name ?? "?"}</span>
                  <button type="button" onClick={() => deleteRelationMutation.mutate(rel.id)}
                    className="ml-0.5 text-gray-400 hover:text-red-500 transition-colors" title="Remove relation">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Member panel */}
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

      {/* Add/Edit Member modal */}
      <AddMemberModal
        open={showMemberForm}
        editingId={editingMemberId}
        initialData={editingFormData ?? EMPTY_MEMBER_FORM}
        isSaving={isSavingMember}
        existingMembers={tree.members}
        onClose={closeMemberForm}
        onSubmit={handleMemberSubmit}
      />

      {/* Relation form modal */}
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
                <label htmlFor="d-rel-from" className="block text-xs font-semibold text-gray-600 mb-1">From Member</label>
                <select id="d-rel-from" value={relFrom} onChange={(e) => setRelFrom(e.target.value)} required
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
                  <option value="">Select member…</option>
                  {tree.members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="d-rel-type" className="block text-xs font-semibold text-gray-600 mb-1">Relation</label>
                <select id="d-rel-type" value={relType} onChange={(e) => setRelType(e.target.value as RelationType)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
                  <option value="parent">is parent of →</option>
                  <option value="child">is child of →</option>
                  <option value="spouse">is spouse of →</option>
                  <option value="sibling">is sibling of →</option>
                </select>
              </div>
              <div>
                <label htmlFor="d-rel-to" className="block text-xs font-semibold text-gray-600 mb-1">To Member</label>
                <select id="d-rel-to" value={relTo} onChange={(e) => setRelTo(e.target.value)} required
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
                  <option value="">Select member…</option>
                  {tree.members.filter((m) => m.id.toString() !== relFrom).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={!relFrom || !relTo || addRelationMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50">
                  {addRelationMutation.isPending ? "Adding…" : "Add Connection"}
                </button>
                <button type="button" onClick={() => setShowRelationForm(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
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
