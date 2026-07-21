import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { INITIAL_FORUM_POSTS } from "./mockData";
import type { ForumPost } from "./types";

interface ForumContextValue {
  posts: ForumPost[];
  dismissReport: (postId: string) => void;
  removePost: (postId: string) => void;
  restorePost: (postId: string) => void;
  deletePostPermanently: (postId: string) => void;
}

const ForumContext = createContext<ForumContextValue | undefined>(undefined);

export function ForumProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);

  const dismissReport = (postId: string) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, status: "published", reports: [] } : p)));
  };

  const removePost = (postId: string) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, status: "removed" } : p)));
  };

  const restorePost = (postId: string) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, status: "published", reports: [] } : p)));
  };

  const deletePostPermanently = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const value = useMemo(
    () => ({ posts, dismissReport, removePost, restorePost, deletePostPermanently }),
    [posts]
  );

  return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>;
}

export function useForum() {
  const ctx = useContext(ForumContext);
  if (!ctx) throw new Error("useForum must be used within ForumProvider");
  return ctx;
}
