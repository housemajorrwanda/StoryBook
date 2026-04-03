import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { familyTreeService } from '@/services/family-tree.service';
import {
  CreateFamilyTreeRequest,
  UpdateFamilyTreeRequest,
  CreateFamilyMemberRequest,
  UpdateFamilyMemberRequest,
  CreateFamilyRelationRequest,
} from '@/types/family-tree';
import toast from 'react-hot-toast';

// ── Query keys ────────────────────────────────────────────────────────────────

export const familyTreeKeys = {
  myTrees: ['family-trees', 'my'] as const,
  tree: (id: number) => ['family-trees', id] as const,
  publicTrees: (params?: object) => ['family-trees', 'public', params] as const,
  publicTree: (id: number) => ['family-trees', 'public', id] as const,
};

// ── Trees ─────────────────────────────────────────────────────────────────────

export function useMyFamilyTrees() {
  return useQuery({
    queryKey: familyTreeKeys.myTrees,
    queryFn: () => familyTreeService.getMyTrees(),
  });
}

export function useFamilyTree(id: number) {
  return useQuery({
    queryKey: familyTreeKeys.tree(id),
    queryFn: () => familyTreeService.getTreeById(id),
    enabled: !!id,
  });
}

export function usePublicFamilyTrees(params: { skip?: number; limit?: number; search?: string } = {}) {
  return useQuery({
    queryKey: familyTreeKeys.publicTrees(params),
    queryFn: () => familyTreeService.getPublicTrees(params),
  });
}

export function usePublicFamilyTree(id: number) {
  return useQuery({
    queryKey: familyTreeKeys.publicTree(id),
    queryFn: () => familyTreeService.getPublicTreeById(id),
    enabled: !!id,
  });
}

export function useCreateFamilyTree() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFamilyTreeRequest) => familyTreeService.createTree(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: familyTreeKeys.myTrees });
      toast.success('Family tree created');
    },
    onError: () => toast.error('Failed to create family tree'),
  });
}

export function useUpdateFamilyTree(treeId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateFamilyTreeRequest) => familyTreeService.updateTree(treeId, data),
    onSuccess: (updated) => {
      qc.setQueryData(familyTreeKeys.tree(treeId), updated);
      qc.invalidateQueries({ queryKey: familyTreeKeys.myTrees });
      toast.success('Tree updated');
    },
    onError: () => toast.error('Failed to update tree'),
  });
}

export function useDeleteFamilyTree() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (treeId: number) => familyTreeService.deleteTree(treeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: familyTreeKeys.myTrees });
      toast.success('Family tree deleted');
    },
    onError: () => toast.error('Failed to delete family tree'),
  });
}

// ── Members ───────────────────────────────────────────────────────────────────

export function useAddFamilyMember(treeId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFamilyMemberRequest) => familyTreeService.addMember(treeId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: familyTreeKeys.tree(treeId) });
      toast.success('Member added');
    },
    onError: () => toast.error('Failed to add member'),
  });
}

export function useUpdateFamilyMember(treeId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, data }: { memberId: number; data: UpdateFamilyMemberRequest }) =>
      familyTreeService.updateMember(treeId, memberId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: familyTreeKeys.tree(treeId) });
      toast.success('Member updated');
    },
    onError: () => toast.error('Failed to update member'),
  });
}

export function useDeleteFamilyMember(treeId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (memberId: number) => familyTreeService.deleteMember(treeId, memberId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: familyTreeKeys.tree(treeId) });
      toast.success('Member removed');
    },
    onError: () => toast.error('Failed to remove member'),
  });
}

// ── Relations ─────────────────────────────────────────────────────────────────

export function useAddFamilyRelation(treeId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFamilyRelationRequest) => familyTreeService.addRelation(treeId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: familyTreeKeys.tree(treeId) });
      toast.success('Relation added');
    },
    onError: () => toast.error('Failed to add relation'),
  });
}

export function useDeleteFamilyRelation(treeId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (relationId: number) => familyTreeService.deleteRelation(treeId, relationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: familyTreeKeys.tree(treeId) });
      toast.success('Relation removed');
    },
    onError: () => toast.error('Failed to remove relation'),
  });
}
