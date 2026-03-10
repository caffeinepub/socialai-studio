import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Post } from "../backend.d";
import { useActor } from "./useActor";

export function useGetPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPost(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Post | null>({
    queryKey: ["post", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getPost(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useGetDashboardStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      if (!actor)
        return {
          totalPosts: 0n,
          scheduled: 0n,
          published: 0n,
          avgEngagement: 0,
        };
      return actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      idea,
      platform,
    }: { idea: string; platform: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.createPost(idea, platform);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useUpdatePostCaption() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, caption }: { id: bigint; caption: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updatePostCaption(id, caption);
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["post", id.toString()] });
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePostHashtags() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      hashtags,
    }: { id: bigint; hashtags: string[] }) => {
      if (!actor) throw new Error("No actor");
      return actor.updatePostHashtags(id, hashtags);
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["post", id.toString()] });
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useSchedulePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      scheduledAt,
    }: { id: bigint; scheduledAt: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.schedulePost(id, scheduledAt);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useUpdatePostStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updatePostStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deletePost(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}
