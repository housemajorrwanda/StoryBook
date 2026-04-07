import axiosInstance from '@/config/axiosInstance';
import {
  FamilyTree,
  FamilyMember,
  FamilyRelation,
  FamilyTreesPublicResponse,
  MemberSearchResult,
  CreateFamilyTreeRequest,
  UpdateFamilyTreeRequest,
  CreateFamilyMemberRequest,
  UpdateFamilyMemberRequest,
  CreateFamilyRelationRequest,
} from '@/types/family-tree';

class FamilyTreeService {
  // ── Trees ──────────────────────────────────────────────────────────────────

  async getPublicTrees(params: { skip?: number; limit?: number; search?: string } = {}): Promise<FamilyTreesPublicResponse> {
    const p: Record<string, string> = {};
    if (params.skip !== undefined) p.skip = params.skip.toString();
    if (params.limit !== undefined) p.limit = params.limit.toString();
    if (params.search) p.search = params.search;
    const res = await axiosInstance.get<FamilyTreesPublicResponse>('/family-trees/public', { params: p });
    return res.data;
  }

  async getPublicTreeById(id: number): Promise<FamilyTree> {
    const res = await axiosInstance.get<FamilyTree>(`/family-trees/public/${id}`);
    return res.data;
  }

  async getMyTrees(): Promise<FamilyTree[]> {
    const res = await axiosInstance.get<FamilyTree[]>('/family-trees/my');
    return res.data;
  }

  async getTreeById(id: number): Promise<FamilyTree> {
    const res = await axiosInstance.get<FamilyTree>(`/family-trees/${id}`);
    return res.data;
  }

  async createTree(data: CreateFamilyTreeRequest): Promise<FamilyTree> {
    const res = await axiosInstance.post<FamilyTree>('/family-trees', data);
    return res.data;
  }

  async updateTree(id: number, data: UpdateFamilyTreeRequest): Promise<FamilyTree> {
    const res = await axiosInstance.patch<FamilyTree>(`/family-trees/${id}`, data);
    return res.data;
  }

  async deleteTree(id: number): Promise<void> {
    await axiosInstance.delete(`/family-trees/${id}`);
  }

  // ── Members ────────────────────────────────────────────────────────────────

  async addMember(treeId: number, data: CreateFamilyMemberRequest): Promise<FamilyMember> {
    const res = await axiosInstance.post<FamilyMember>(`/family-trees/${treeId}/members`, data);
    return res.data;
  }

  async updateMember(treeId: number, memberId: number, data: UpdateFamilyMemberRequest): Promise<FamilyMember> {
    const res = await axiosInstance.patch<FamilyMember>(`/family-trees/${treeId}/members/${memberId}`, data);
    return res.data;
  }

  async deleteMember(treeId: number, memberId: number): Promise<void> {
    await axiosInstance.delete(`/family-trees/${treeId}/members/${memberId}`);
  }

  // ── Relations ──────────────────────────────────────────────────────────────

  async addRelation(treeId: number, data: CreateFamilyRelationRequest): Promise<FamilyRelation> {
    const res = await axiosInstance.post<FamilyRelation>(`/family-trees/${treeId}/relations`, data);
    return res.data;
  }

  async deleteRelation(treeId: number, relationId: number): Promise<void> {
    await axiosInstance.delete(`/family-trees/${treeId}/relations/${relationId}`);
  }

  // ── Duplicate detection ────────────────────────────────────────────────────

  async searchMembersByName(name: string, limit = 10): Promise<MemberSearchResult[]> {
    const res = await axiosInstance.get<MemberSearchResult[]>('/family-trees/members/search', {
      params: { name, limit },
    });
    return res.data;
  }
}

export const familyTreeService = new FamilyTreeService();
