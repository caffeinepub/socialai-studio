import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PostAnalytics {
    shares: bigint;
    engagementRate: number;
    likes: bigint;
    comments: bigint;
    reach: bigint;
}
export interface UserProfile {
    name: string;
}
export interface Post {
    id: bigint;
    status: string;
    selectedCaption: string;
    hashtags: Array<string>;
    owner: Principal;
    idea: string;
    createdAt: bigint;
    platform: string;
    analytics: PostAnalytics;
    optimizedCaption: string;
    scheduledAt?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(idea: string, platform: string): Promise<Post>;
    deletePost(id: bigint): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardStats(): Promise<{
        scheduled: bigint;
        published: bigint;
        avgEngagement: number;
        totalPosts: bigint;
    }>;
    getPost(id: bigint): Promise<Post | null>;
    getPosts(): Promise<Array<Post>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    schedulePost(id: bigint, scheduledAt: string): Promise<Post | null>;
    updateAnalytics(id: bigint, likes: bigint, comments: bigint, shares: bigint, reach: bigint, engagementRate: number): Promise<Post | null>;
    updatePostCaption(id: bigint, caption: string): Promise<Post | null>;
    updatePostHashtags(id: bigint, hashtags: Array<string>): Promise<Post | null>;
    updatePostStatus(id: bigint, status: string): Promise<Post | null>;
}
