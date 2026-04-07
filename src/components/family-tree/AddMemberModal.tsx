"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  X, Camera, Upload, Plus, Trash2, Search,
  MapPin, User, ChevronDown, ChevronUp, Loader2, CheckCircle,
} from "lucide-react";
import Image from "next/image";
import {
  Gender,
  CreateFamilyMemberRequest,
  MemberSearchResult,
  FamilyMember,
  RelationType,
} from "@/types/family-tree";
import { useSearchFamilyMembers } from "@/hooks/family-tree/use-family-tree";
import toast from "react-hot-toast";
import {
  RWANDA_LOCATIONS,
  getSectorsByDistrict,
} from "@/lib/rwanda-locations";

// ── Rwanda cascading data ─────────────────────────────────────────────────────

const PROVINCES = Object.keys(RWANDA_LOCATIONS);

function getDistricts(province: string): string[] {
  return Object.keys(RWANDA_LOCATIONS[province] ?? {});
}

// ── Cloudinary upload ─────────────────────────────────────────────────────────

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

async function uploadPhotosToCloudinary(files: File[]): Promise<string[]> {
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f));
  const res = await fetch(`${API_BASE}/upload/images`, { method: "POST", body: fd });
  if (!res.ok) throw new Error("Photo upload failed");
  const data = await res.json();
  return (data.successful ?? []).map((s: { url: string }) => s.url);
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MemberFormData {
  name: string;
  birthDate: string;
  deathDate: string;
  bio: string;
  gender: Gender | "";
  isAlive: boolean;
  testimonyId: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  photoUrl: string;
  photoUrls: string[];
  // Relation to existing member (set when adding, not editing)
  relativeOfId: string;
  relativeOfType: RelationType;
}

export const EMPTY_MEMBER_FORM: MemberFormData = {
  name: "", birthDate: "", deathDate: "", bio: "",
  gender: "", isAlive: true, testimonyId: "",
  province: "", district: "", sector: "", cell: "",
  photoUrl: "", photoUrls: [],
  relativeOfId: "", relativeOfType: "parent",
};

interface Props {
  open: boolean;
  editingId: number | null;
  initialData?: MemberFormData;
  isSaving: boolean;
  /** Existing tree members — used for "relative of" selector */
  existingMembers?: FamilyMember[];
  onClose: () => void;
  onSubmit: (data: CreateFamilyMemberRequest, relativeOf?: { memberId: number; relationType: RelationType }) => Promise<void>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AddMemberModal({
  open, editingId, initialData, isSaving, existingMembers = [], onClose, onSubmit,
}: Props) {
  const [form, setForm] = useState<MemberFormData>(initialData ?? EMPTY_MEMBER_FORM);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [debouncedName, setDebouncedName] = useState("");
  const [pickedSuggestion, setPickedSuggestion] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form when modal opens/closes or initialData changes
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setShowLocation(!!(initialData.district || initialData.sector));
    } else {
      setForm(EMPTY_MEMBER_FORM);
      setShowLocation(false);
    }
    setPhotoFiles([]);
    setPhotoPreviews([]);
    setPickedSuggestion(false);
  }, [initialData, open]);

  // Clear sector when district changes
  const prevDistrict = useRef(form.district);
  useEffect(() => {
    if (form.district !== prevDistrict.current) {
      setForm((f) => ({ ...f, sector: "" }));
      prevDistrict.current = form.district;
    }
  }, [form.district]);

  // Clear district when province changes
  const prevProvince = useRef(form.province);
  useEffect(() => {
    if (form.province !== prevProvince.current) {
      setForm((f) => ({ ...f, district: "", sector: "" }));
      prevProvince.current = form.province;
    }
  }, [form.province]);

  // Debounce name for duplicate search
  useEffect(() => {
    if (editingId) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedName(form.name), 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [form.name, editingId]);

  const { data: suggestions } = useSearchFamilyMembers(debouncedName, !editingId && !pickedSuggestion);
  const showSuggestions = !editingId && !pickedSuggestion && (suggestions?.length ?? 0) > 0 && form.name.trim().length >= 2;

  const set = useCallback(<K extends keyof MemberFormData>(k: K, v: MemberFormData[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
  }, []);

  // ── Photo handling ─────────────────────────────────────────────────────────

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 10 - photoFiles.length - form.photoUrls.length);
    if (!files.length) return;
    const previews = files.map((f) => URL.createObjectURL(f));
    setPhotoFiles((prev) => [...prev, ...files]);
    setPhotoPreviews((prev) => [...prev, ...previews]);
    e.target.value = "";
  };

  const removeNewPhoto = (i: number) => {
    URL.revokeObjectURL(photoPreviews[i]);
    setPhotoFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPhotoPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const removeExistingPhoto = (url: string) => {
    const updated = form.photoUrls.filter((u) => u !== url);
    set("photoUrls", updated);
    if (form.photoUrl === url) set("photoUrl", updated[0] ?? "");
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    let allUrls = [...form.photoUrls];
    if (photoFiles.length > 0) {
      setUploading(true);
      try {
        const uploaded = await uploadPhotosToCloudinary(photoFiles);
        allUrls = [...allUrls, ...uploaded];
      } catch {
        toast.error("Photo upload failed — member will be saved without new photos");
        // Continue saving member even if photo upload fails
      } finally {
        setUploading(false);
      }
    }

    // profileUrl: explicit choice → first uploaded → first existing → nothing
    const profileUrl = form.photoUrl || allUrls[0] || "";
    const payload: CreateFamilyMemberRequest = {
      name: form.name.trim(),
      photoUrl: profileUrl || undefined,
      photoUrls: allUrls.length ? allUrls : undefined,
      birthDate: form.birthDate.trim() || undefined,
      deathDate: form.deathDate.trim() || undefined,
      bio: form.bio.trim() || undefined,
      gender: (form.gender as Gender) || undefined,
      isAlive: form.isAlive,
      testimonyId: form.testimonyId ? parseInt(form.testimonyId) : undefined,
      district: form.district || undefined,
      sector: form.sector || undefined,
      cell: form.cell.trim() || undefined,
    };

    const relativeOf = (!editingId && form.relativeOfId)
      ? { memberId: parseInt(form.relativeOfId), relationType: form.relativeOfType }
      : undefined;

    await onSubmit(payload, relativeOf);
  };

  if (!open) return null;

  const districts = getDistricts(form.province);
  const sectors = getSectorsByDistrict(form.district);
  const allPhotoCount = form.photoUrls.length + photoFiles.length;
  const canAddMore = allPhotoCount < 10;
  const locationSummary = [form.district, form.sector].filter(Boolean).join(", ");

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px]" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 sm:inset-x-4 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 z-40 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl sm:max-w-lg sm:mx-auto flex flex-col overflow-hidden max-h-[92vh] sm:max-h-[88vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {editingId ? "Edit Member" : "Add Family Member"}
            </h2>
            {!editingId && (
              <p className="text-xs text-gray-400 mt-0.5">Only name is required — fill in what you know</p>
            )}
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* ── Name + duplicate detection ─────────────────────────────── */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input type="text" required autoFocus
                value={form.name}
                onChange={(e) => { set("name", e.target.value); setPickedSuggestion(false); }}
                placeholder="e.g. Jean-Paul Habimana"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>

            {showSuggestions && (
              <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-amber-100">
                  <Search className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <p className="text-xs font-semibold text-amber-800">
                    {suggestions!.length} similar name{suggestions!.length !== 1 ? "s" : ""} found in public trees
                  </p>
                </div>
                <div className="divide-y divide-amber-100 max-h-40 overflow-y-auto">
                  {suggestions!.map((s) => (
                    <SuggestionRow key={s.id} suggestion={s} onUse={() => {
                      set("name", s.name);
                      if (s.gender) set("gender", s.gender as Gender);
                      if (s.birthDate) set("birthDate", s.birthDate);
                      if (s.photoUrl) { set("photoUrl", s.photoUrl); set("photoUrls", [s.photoUrl]); }
                      // Pre-fill location dropdowns from suggestion
                      if (s.district) {
                        // Find province for this district
                        for (const [prov, dists] of Object.entries(RWANDA_LOCATIONS)) {
                          if (s.district in dists) { set("province", prov); break; }
                        }
                        set("district", s.district);
                        if (s.sector) set("sector", s.sector);
                        if (s.cell) set("cell", s.cell);
                        setShowLocation(true);
                      }
                      set("relativeOfId", "");
                      setPickedSuggestion(true);
                    }} />
                  ))}
                </div>
                <div className="px-3 py-2 border-t border-amber-100">
                  <button type="button" onClick={() => setPickedSuggestion(true)}
                    className="text-xs text-amber-700 font-medium hover:underline">
                    None of these — add as new person
                  </button>
                </div>
              </div>
            )}
            {pickedSuggestion && form.name && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
                <CheckCircle className="w-3.5 h-3.5 text-gray-400" /> Pre-filled from existing record — edit as needed
              </p>
            )}
          </div>

          {/* ── Photos ──────────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-600">
                Photos <span className="font-normal text-gray-400">(first = profile, up to 10)</span>
              </label>
              {canAddMore && (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handlePhotoSelect} />

            {allPhotoCount === 0 ? (
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="w-full h-16 sm:h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 text-gray-400 hover:border-gray-300 hover:bg-gray-50 transition-all">
                <Camera className="w-4 h-4" />
                <span className="text-xs">Upload photos</span>
              </button>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {form.photoUrls.map((url) => (
                  <div key={url} className="relative group">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-colors ${form.photoUrl === url ? "border-gray-900" : "border-gray-200"}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                      {form.photoUrl !== url && (
                        <button type="button" onClick={() => set("photoUrl", url)}
                          className="text-[9px] font-semibold text-white bg-gray-900 px-1.5 py-0.5 rounded-full leading-none">
                          Profile
                        </button>
                      )}
                      <button type="button" title="Remove photo" aria-label="Remove photo" onClick={() => removeExistingPhoto(url)}
                        className="p-1 rounded-full bg-white/20 text-white">
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                    {form.photoUrl === url && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-700 bg-gray-100 px-1 rounded-sm leading-tight whitespace-nowrap">Profile</span>
                    )}
                  </div>
                ))}
                {photoPreviews.map((url, i) => (
                  <div key={url} className="relative group">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover opacity-80" />
                    </div>
                    <button type="button" title="Remove photo" aria-label="Remove photo" onClick={() => removeNewPhoto(i)}
                      className="absolute -top-1 -right-1 p-0.5 rounded-full bg-gray-900 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
                {canAddMore && (
                  <button type="button" title="Add more photos" aria-label="Add more photos" onClick={() => fileInputRef.current?.click()}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-300 hover:bg-gray-50 transition-all">
                    <Upload className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── Gender + Status ──────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="am-gender" className="block text-xs font-semibold text-gray-600 mb-1.5">Gender</label>
              <select id="am-gender" value={form.gender} onChange={(e) => set("gender", e.target.value as Gender | "")}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
                <option value="">Unknown</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
              <button type="button" onClick={() => set("isAlive", !form.isAlive)}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  form.isAlive
                    ? "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                    : "bg-gray-900 border-gray-900 text-white hover:bg-gray-800"
                }`}>
                <span className={`w-2 h-2 rounded-full ${form.isAlive ? "bg-emerald-500" : "bg-gray-400"}`} />
                {form.isAlive ? "Living" : "Deceased"}
              </button>
            </div>
          </div>

          {/* ── Dates ───────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Birth Year / Date</label>
              <input type="text" value={form.birthDate} onChange={(e) => set("birthDate", e.target.value)}
                placeholder="e.g. 1952"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            {!form.isAlive && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Death Year / Date</label>
                <input type="text" value={form.deathDate} onChange={(e) => set("deathDate", e.target.value)}
                  placeholder="e.g. 2010"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
              </div>
            )}
          </div>

          {/* ── Location — cascading dropdowns ──────────────────────────── */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <button type="button" onClick={() => setShowLocation((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">Location</span>
                {locationSummary && (
                  <span className="text-xs text-gray-400 font-normal truncate max-w-[120px] sm:max-w-[180px]">{locationSummary}</span>
                )}
              </div>
              {showLocation ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {showLocation && (
              <div className="px-4 pb-4 pt-3 space-y-3">
                {/* Province */}
                <div>
                  <label htmlFor="am-province" className="block text-xs font-semibold text-gray-600 mb-1">Province</label>
                  <select id="am-province" value={form.province} onChange={(e) => set("province", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
                    <option value="">Select province…</option>
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                {/* District — only when province selected */}
                {form.province && (
                  <div>
                    <label htmlFor="am-district" className="block text-xs font-semibold text-gray-600 mb-1">District</label>
                    <select id="am-district" value={form.district} onChange={(e) => set("district", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
                      <option value="">Select district…</option>
                      {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                )}

                {/* Sector — only when district selected */}
                {form.district && (
                  <div>
                    <label htmlFor="am-sector" className="block text-xs font-semibold text-gray-600 mb-1">Sector</label>
                    <select id="am-sector" value={form.sector} onChange={(e) => set("sector", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
                      <option value="">Select sector…</option>
                      {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}

                {/* Cell — free text only at this level (2,148 cells too large) */}
                {form.sector && (
                  <div>
                    <label htmlFor="am-cell" className="block text-xs font-semibold text-gray-600 mb-1">Cell <span className="font-normal text-gray-400">(optional)</span></label>
                    <input id="am-cell" type="text" value={form.cell} onChange={(e) => set("cell", e.target.value)}
                      placeholder="Enter cell name"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Relative of (add mode only) ─────────────────────────────── */}
          {!editingId && existingMembers.length > 0 && (
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-700">Relative of</p>
                <p className="text-xs text-gray-400 mt-0.5">Optionally connect this person to an existing member</p>
              </div>
              <div className="px-4 py-3 space-y-3">
                <div>
                  <label htmlFor="am-relative" className="block text-xs font-semibold text-gray-600 mb-1">Select member</label>
                  <select id="am-relative" value={form.relativeOfId} onChange={(e) => set("relativeOfId", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
                    <option value="">None (add without connecting)</option>
                    {existingMembers.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                {form.relativeOfId && (
                  <div>
                    <label htmlFor="am-reltype" className="block text-xs font-semibold text-gray-600 mb-1">
                      This new person is…
                    </label>
                    <select id="am-reltype" value={form.relativeOfType} onChange={(e) => set("relativeOfType", e.target.value as RelationType)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
                      <option value="child">Child of {existingMembers.find(m => m.id.toString() === form.relativeOfId)?.name ?? "them"}</option>
                      <option value="parent">Parent of {existingMembers.find(m => m.id.toString() === form.relativeOfId)?.name ?? "them"}</option>
                      <option value="spouse">Spouse of {existingMembers.find(m => m.id.toString() === form.relativeOfId)?.name ?? "them"}</option>
                      <option value="sibling">Sibling of {existingMembers.find(m => m.id.toString() === form.relativeOfId)?.name ?? "them"}</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Bio ─────────────────────────────────────────────────────── */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bio / Notes</label>
            <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)}
              placeholder="Brief biography or notes about this person"
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none" />
          </div>

          {/* ── Link Testimony ───────────────────────────────────────────── */}
          <div>
            <label htmlFor="am-testimony" className="block text-xs font-semibold text-gray-600 mb-1.5">
              Link Testimony <span className="font-normal text-gray-400">(optional — paste testimony ID)</span>
            </label>
            <input id="am-testimony" type="number" min={1} value={form.testimonyId}
              onChange={(e) => set("testimonyId", e.target.value)}
              placeholder="Testimony ID"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>

          {/* ── Actions ─────────────────────────────────────────────────── */}
          <div className="flex gap-2 pt-1 pb-2">
            <button type="submit" disabled={!form.name.trim() || isSaving || uploading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50">
              {(isSaving || uploading) && <Loader2 className="w-4 h-4 animate-spin" />}
              {uploading ? "Uploading…" : isSaving ? "Saving…" : editingId ? "Save Changes" : "Add Member"}
            </button>
            <button type="button" onClick={onClose}
              className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// ── Suggestion row ─────────────────────────────────────────────────────────────

function SuggestionRow({ suggestion: s, onUse }: { suggestion: MemberSearchResult; onUse: () => void }) {
  const initials = s.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const location = [s.district, s.sector].filter(Boolean).join(", ");

  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
        {s.photoUrl ? (
          <Image src={s.photoUrl} alt={s.name} width={36} height={36} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-bold text-gray-500">{initials}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
        <p className="text-[11px] text-gray-400 truncate">
          {[s.birthDate ? `b. ${s.birthDate}` : "", location, s.familyTree?.title].filter(Boolean).join(" · ")}
        </p>
      </div>
      <button type="button" onClick={onUse}
        className="shrink-0 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap">
        Use this
      </button>
    </div>
  );
}
