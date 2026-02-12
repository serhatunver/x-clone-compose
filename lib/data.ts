/* ================= TYPES ================= */

export interface Post {
  _id: string;
  author: string; // user id
  content: string;
  media?: string;
  likes: string[]; // user ids
  repost: string[]; // user ids
  comments: string[]; // comment ids (mock)
  createdAt: string;
}

export interface User {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
  cover: string;
  bio: string;

  followers: string[]; // user ids
  following: string[]; // user ids

  followersCount: string;
  followingCount: string;

  isFollowing?: boolean; // relative to CURRENT_USER

  posts: Post[];

  createdAt: string;
}

/* ================= CURRENT AUTH USER ================= */

export const CURRENT_USER_ID = '99';

export const CURRENT_USER: User = {
  _id: CURRENT_USER_ID,
  username: 'currentuser',
  fullname: 'Current User',
  avatar: 'https://avatars.githubusercontent.com/u/1',
  cover: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  bio: 'This is the logged-in user.',
  followers: ['1', '2'],
  following: ['1'],
  followersCount: '2',
  followingCount: '1',
  posts: [],
  createdAt: '2024-01-10T10:00:00.000Z',
};

/* ================= USER 1 POSTS ================= */

export const USER_1_POSTS: Post[] = [
  {
    _id: 'p1',
    author: '1',
    content:
      'Building my new social media clone with Next.js 15 + shadcn/ui. Architecture is finally clean.',
    media: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7',
    likes: ['2', '99'],
    repost: ['2'],
    comments: ['c1', 'c2'],
    createdAt: '2025-02-01T12:00:00.000Z',
  },
  {
    _id: 'p2',
    author: '1',
    content:
      'Radix focus management was confusing at first… now it makes perfect sense.',
    likes: ['2'],
    repost: [],
    comments: [],
    createdAt: '2025-02-03T09:30:00.000Z',
  },
];

/* ================= USER 2 POSTS ================= */

export const USER_2_POSTS: Post[] = [
  {
    _id: 'p3',
    author: '2',
    content:
      'Consistency in file naming (kebab-case) makes scaling projects easier.',
    likes: ['1', '99'],
    repost: ['1'],
    comments: [],
    createdAt: '2025-02-02T15:45:00.000Z',
  },
];

/* ================= USERS ================= */

export const USER_1: User = {
  _id: '1',
  username: 'serhatunver',
  fullname: 'Serhat Ünver',
  avatar: 'https://avatars.githubusercontent.com/u/96500903',
  cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
  bio: 'Frontend developer building a Twitter/X style social platform.',
  followers: ['2', '99'],
  following: ['2'],
  followersCount: '2',
  followingCount: '1',
  isFollowing: CURRENT_USER.following.includes('1'),
  posts: USER_1_POSTS,
  createdAt: '2023-10-01T08:00:00.000Z',
};

export const USER_2: User = {
  _id: '2',
  username: 'johndoe',
  fullname: 'John Doe',
  avatar: 'https://avatars.githubusercontent.com/u/583231',
  cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
  bio: 'Product designer. Coffee enthusiast. Minimal UI lover.',
  followers: ['1'],
  following: ['1', '99'],
  followersCount: '1',
  followingCount: '2',
  isFollowing: CURRENT_USER.following.includes('2'),
  posts: USER_2_POSTS,
  createdAt: '2024-05-15T11:20:00.000Z',
};

/* ================= ALL USERS ================= */

export const USERS: User[] = [CURRENT_USER, USER_1, USER_2];

/* ================= HELPERS ================= */

// get user by username
export const getUserByUsername = (username: string) =>
  USERS.find((u) => u.username === username);

// get posts sorted by newest
export const getAllPosts = () =>
  USERS.flatMap((u) => u.posts).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

// check if current user liked a post
export const hasLiked = (post: Post) => post.likes.includes(CURRENT_USER_ID);
