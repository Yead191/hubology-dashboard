import type { ForumPost } from "./types";

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: "post-001",
    title: "Anyone else getting scraped comments pushing crypto signals?",
    body:
      "Over the last week I've had three comments on my growth thread pushing a 'guaranteed returns' Telegram group. Reporting each one but they keep coming back under new usernames. Anyone found a way to filter this out?",
    category: "General",
    authorName: "Nadia Farouk",
    authorAvatar: "https://i.pravatar.cc/160?img=44",
    createdAt: "2026-07-05T14:20:00Z",
    upvotes: 18,
    commentsCount: 6,
    status: "reported",
    reports: [
      { id: "rep-001", reason: "Spam / scam link in comments", reportedBy: "Daniel Osei", reportedAt: "2026-07-06T09:10:00Z" },
      { id: "rep-002", reason: "Suspicious external link", reportedBy: "Grace Whitfield", reportedAt: "2026-07-06T15:45:00Z" },
    ],
  },
  {
    id: "post-002",
    title: "Is a 15% MoM growth rate realistic for a two-person team?",
    body:
      "We're pre-seed, two founders, no hires yet. Investors keep asking for 15% MoM growth projections and it feels arbitrary. Curious what other early founders are actually hitting before their first hire.",
    category: "Growth",
    authorName: "Marina Cole",
    authorAvatar: "https://i.pravatar.cc/160?img=9",
    createdAt: "2026-07-08T10:05:00Z",
    upvotes: 42,
    commentsCount: 19,
    status: "published",
    reports: [],
  },
  {
    id: "post-003",
    title: "This 'growth hack' post is just a disguised ad for a paid course",
    body:
      "The post reads like generic advice for the first three paragraphs and then pivots hard into 'my $997 course teaches the rest.' Feels like it's against community guidelines around self-promotion.",
    category: "Marketing",
    authorName: "Tomas Riek",
    authorAvatar: "https://i.pravatar.cc/160?img=53",
    createdAt: "2026-07-04T08:30:00Z",
    upvotes: 7,
    commentsCount: 3,
    status: "reported",
    reports: [
      { id: "rep-003", reason: "Undisclosed paid promotion", reportedBy: "Rafael Duarte", reportedAt: "2026-07-04T12:00:00Z" },
    ],
  },
  {
    id: "post-004",
    title: "Stack recommendations for a lean two-person eng team?",
    body:
      "Building a B2B SaaS MVP, want to move fast without painting ourselves into a corner. Currently leaning Next.js + Postgres + a managed auth provider. Any regrets from teams who went a similar route?",
    category: "Tech",
    authorName: "Grace Whitfield",
    authorAvatar: "https://i.pravatar.cc/160?img=60",
    createdAt: "2026-07-09T09:15:00Z",
    upvotes: 31,
    commentsCount: 14,
    status: "published",
    reports: [],
  },
  {
    id: "post-005",
    title: "Warning: someone is impersonating a verified expert in the DMs",
    body:
      "Got a DM from an account using the profile photo and name of one of the verified formation experts here, asking for payment outside the platform. Reporting the thread but flagging in case others get the same message.",
    category: "General",
    authorName: "David Okonjo",
    authorAvatar: "https://i.pravatar.cc/160?img=15",
    createdAt: "2026-07-07T17:50:00Z",
    upvotes: 55,
    commentsCount: 11,
    status: "reported",
    reports: [
      { id: "rep-004", reason: "Impersonation of a verified expert", reportedBy: "Priya Nandakumar", reportedAt: "2026-07-07T18:20:00Z" },
      { id: "rep-005", reason: "Possible payment scam", reportedBy: "Elena Kowalski", reportedAt: "2026-07-08T07:05:00Z" },
      { id: "rep-006", reason: "Impersonation of a verified expert", reportedBy: "Marcus Verlaine", reportedAt: "2026-07-08T09:40:00Z" },
    ],
  },
  {
    id: "post-006",
    title: "How do you structure your first advisory agreement?",
    body:
      "Bringing on an advisor for 0.25% equity, four-year vest. What clauses do people always forget to include in the first draft?",
    category: "Startup Strategy",
    authorName: "Alex Chen",
    authorAvatar: "https://i.pravatar.cc/160?img=25",
    createdAt: "2026-06-28T13:00:00Z",
    upvotes: 26,
    commentsCount: 9,
    status: "published",
    reports: [],
  },
  {
    id: "post-007",
    title: "[removed] Repeated off-topic promotional thread",
    body:
      "This post was removed after repeated reports for posting unrelated promotional content across multiple category threads.",
    category: "Marketing",
    authorName: "Unknown user",
    authorAvatar: "https://i.pravatar.cc/160?img=68",
    createdAt: "2026-06-20T11:00:00Z",
    upvotes: 2,
    commentsCount: 1,
    status: "removed",
    reports: [
      { id: "rep-007", reason: "Off-topic self-promotion", reportedBy: "Sofia Marchetti", reportedAt: "2026-06-21T10:00:00Z" },
    ],
  },
];
