export type RelationType = 'parent' | 'spouse' | 'sibling' | 'child';
export type Gender = 'male' | 'female' | 'other' | 'unknown';

export interface FamilyMemberTestimony {
  id: number;
  eventTitle: string;
  fullName: string | null;
}

export interface FamilyMember {
  id: number;
  name: string;
  photoUrl: string | null;
  photoUrls: string[];
  birthDate: string | null;
  deathDate: string | null;
  bio: string | null;
  gender: Gender | null;
  isAlive: boolean;
  district: string | null;
  sector: string | null;
  cell: string | null;
  village: string | null;
  testimonyId: number | null;
  testimony: FamilyMemberTestimony | null;
  createdAt: string;
  updatedAt: string;
}

export interface MemberSearchResult {
  id: number;
  name: string;
  photoUrl: string | null;
  birthDate: string | null;
  gender: string | null;
  district: string | null;
  sector: string | null;
  cell: string | null;
  village: string | null;
  familyTree: {
    id: number;
    title: string;
    user: { id: number; fullName: string | null };
  };
}

export interface FamilyRelation {
  id: number;
  fromMemberId: number;
  toMemberId: number;
  relationType: RelationType;
  createdAt: string;
}

export interface FamilyTreeOwner {
  id: number;
  fullName: string | null;
  avatar: string | null;
}

export interface FamilyTree {
  id: number;
  title: string;
  description: string | null;
  isPublic: boolean;
  userId: number;
  user: FamilyTreeOwner;
  members: FamilyMember[];
  relations: FamilyRelation[];
  createdAt: string;
  updatedAt: string;
  _count?: { members: number; relations: number };
}

export interface FamilyTreesPublicResponse {
  data: FamilyTree[];
  meta: { total: number; skip: number; limit: number };
}

// ── Request DTOs ──────────────────────────────────────────────────────────────

export interface CreateFamilyTreeRequest {
  title: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateFamilyTreeRequest {
  title?: string;
  description?: string;
  isPublic?: boolean;
}

export interface CreateFamilyMemberRequest {
  name: string;
  photoUrl?: string;
  photoUrls?: string[];
  birthDate?: string;
  deathDate?: string;
  bio?: string;
  gender?: Gender;
  isAlive?: boolean;
  testimonyId?: number;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
}

export interface UpdateFamilyMemberRequest {
  name?: string;
  photoUrl?: string;
  photoUrls?: string[];
  birthDate?: string;
  deathDate?: string;
  bio?: string;
  gender?: Gender;
  isAlive?: boolean;
  testimonyId?: number | null;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
}

export interface CreateFamilyRelationRequest {
  fromMemberId: number;
  toMemberId: number;
  relationType: RelationType;
}
