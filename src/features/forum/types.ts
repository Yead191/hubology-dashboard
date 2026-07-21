export type ForumCategory = "Startup Strategy" | "Marketing" | "Growth" | "Tech" | "General";
export type PostStatus = "published" | "reported" | "removed";

export interface ForumReport {
  id: string;
  reason: string;
  reportedBy: string;
  reportedAt: string;
}

export interface ForumPost {
  id: string;
  title: string;
  body: string;
  category: ForumCategory;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  upvotes: number;
  commentsCount: number;
  status: PostStatus;
  reports: ForumReport[];
}

export const FORUM_CATEGORIES: ForumCategory[] = ["Startup Strategy", "Marketing", "Growth", "Tech", "General"];
