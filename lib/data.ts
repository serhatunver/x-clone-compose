/* ================= TYPES ================= */

export interface Post {
  _id: string;
  authorId: string;
  author?: User; // populated in PostCard for easier access to author details
  content: string;
  media?: string;
  likes: string[]; // user ids
  repost: string[]; // user ids
  comments: Post[];
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

  posts?: Post[];

  createdAt?: string;
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
  posts: [
    {
      _id: 'p0',
      authorId: CURRENT_USER_ID,
      content: 'Hello world! This is my first post.',
      media: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d',
      likes: ['1', '2'],
      repost: [],
      comments: [],
      createdAt: '2025-01-01T10:00:00.000Z',
    },
    {
      _id: 'p00',
      authorId: CURRENT_USER_ID,
      content: 'Just setting up my profile. Excited to be here!',
      media: 'https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18',
      likes: ['1'],
      repost: ['2'],
      comments: [],
      createdAt: '2025-01-05T14:30:00.000Z',
    },
    {
      _id: 'p000',
      authorId: CURRENT_USER_ID,
      content: 'Enjoying the platform so far. Loving the community!',
      media: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
      likes: ['2'],
      repost: ['1'],
      comments: [],
      createdAt: '2025-01-08T18:45:00.000Z',
    },
    {
      _id: 'p0000',
      authorId: CURRENT_USER_ID,
      content: 'Looking forward to sharing more updates soon!',
      media: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
      likes: ['1', '2'],
      repost: [],
      comments: [],
      createdAt: '2025-01-10T12:00:00.000Z',
    },
    {
      _id: 'p00000',
      authorId: CURRENT_USER_ID,
      content: 'Just had an amazing brainstorming session with my team!',
      media: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7',
      likes: ['1'],
      repost: ['2'],
      comments: [],
      createdAt: '2025-01-12T16:20:00.000Z',
    },
  ],
  createdAt: '2024-01-10T10:00:00.000Z',
};

/* ================= USER 1 POSTS ================= */

export const USER_1_POSTS: Post[] = [
  {
    _id: 'p1',
    authorId: '1',
    content:
      'Building my new social media clone with Next.js 15 + shadcn/ui. Architecture is finally clean.',
    media: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7',
    likes: ['2', '99'],
    repost: ['2'],
    comments: [
      {
        _id: 'c0',
        authorId: '2',
        content: 'This is a comment on the first post.',
        likes: ['1'],
        repost: [],
        comments: [],
        createdAt: '2025-02-01T13:00:00.000Z',
      },
    ],
    createdAt: '2025-02-01T12:00:00.000Z',
  },
  {
    _id: 'p2',
    authorId: '1',
    content:
      'Radix focus management was confusing at first… now it makes perfect sense.',
    likes: ['2'],
    repost: [],
    comments: [],
    createdAt: '2025-02-03T09:30:00.000Z',
  },
  {
    _id: 'p11',
    authorId: '1',
    content:
      'Just had an amazing brainstorming session with my team. Excited for what’s coming next!',
    media: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d',
    likes: ['2', '99'],
    repost: ['2'],
    comments: [],
    createdAt: '2025-02-05T16:20:00.000Z',
  },
  {
    _id: 'p12',
    authorId: '1',
    content:
      'Reflecting on my development journey so far. Grateful for all the learning and growth.',
    media: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
    likes: ['2'],
    repost: [],
    comments: [],
    createdAt: '2025-02-07T14:10:00.000Z',
  },
  {
    _id: 'p13',
    authorId: '1',
    content:
      'Just wrapped up a project! Feeling accomplished and ready for the next challenge!',
    likes: ['2', '99'],
    repost: ['2'],
    comments: [],
    createdAt: '2025-02-09T11:00:00.000Z',
  },
  {
    _id: 'p14',
    authorId: '1',
    content:
      'Experimenting with new development tools. Loving the flexibility and features they offer!',
    media: 'https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18',
    likes: ['2'],
    repost: [],
    comments: [],
    createdAt: '2025-02-11T13:30:00.000Z',
  },
  {
    _id: 'p15',
    authorId: '1',
    content:
      'Consistency in code formatting (Prettier) makes scaling projects easier.',
    media: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7',
    likes: ['2', '99'],
    repost: ['2'],
    comments: [],
    createdAt: '2025-02-13T15:45:00.000Z',
  },
];

/* ================= USER 2 POSTS ================= */

export const USER_2_POSTS: Post[] = [
  {
    _id: 'p3',
    authorId: '2',
    content:
      'Consistency in file naming (kebab-case) makes scaling projects easier.',
    likes: ['1', '99'],
    repost: ['1'],
    comments: [],
    createdAt: '2025-02-02T15:45:00.000Z',
  },
  {
    _id: 'p4',
    authorId: '2',
    content:
      'Just launched my portfolio! Check it out and let me know what you think.',
    media: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
    likes: ['1'],
    repost: [],
    comments: [],
    createdAt: '2025-02-04T11:20:00.000Z',
  },
  {
    _id: 'p5',
    authorId: '2',
    content:
      'Designing with accessibility in mind is crucial for inclusive user experiences.',
    likes: ['1', '99'],
    repost: ['1'],
    comments: [],
    createdAt: '2025-02-06T17:10:00.000Z',
  },
  {
    _id: 'p6',
    authorId: '2',
    content:
      'Experimenting with new color palettes for my next project. Loving the vibrant tones!',
    media: 'https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18',
    likes: ['1'],
    repost: [],
    comments: [],
    createdAt: '2025-02-08T14:00:00.000Z',
  },
  {
    _id: 'p7',
    authorId: '2',
    content:
      'Just had an amazing brainstorming session with my team. Excited for what’s coming next!',
    likes: ['1', '99'],
    repost: ['1'],
    comments: [],
    createdAt: '2025-02-10T10:30:00.000Z',
  },
  {
    _id: 'p8',
    authorId: '2',
    content:
      'Reflecting on my design journey so far. Grateful for all the learning and growth.',
    media: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d',
    likes: ['1'],
    repost: [],
    comments: [],
    createdAt: '2025-02-12T16:20:00.000Z',
  },
  {
    _id: 'p9',
    authorId: '2',
    content:
      'Just wrapped up a project! Feeling accomplished and ready for the next challenge.',
    likes: ['1', '99'],
    repost: ['1'],
    comments: [],
    createdAt: '2025-02-14T13:15:00.000Z',
  },
  {
    _id: 'p10',
    authorId: '2',
    content:
      'Experimenting with new design tools. Loving the flexibility and features they offer for creating stunning visuals and prototypes that bring my ideas to life! Experimenting with new design tools. Loving the flexibility and features they offer for creating stunning visuals and prototypes that bring my ideas to life!',
    media:
      'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?q=80&w=1147&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    likes: ['1'],
    repost: [],
    comments: [
      {
        _id: 'c1',
        authorId: '2',
        content: 'Great post! I totally agree with your points.',
        likes: ['1'],
        repost: [],
        comments: [],
        createdAt: '2025-02-16T10:00:00.000Z',
      },
      {
        _id: 'c2',
        authorId: '1',
        content:
          'Thanks for sharing your insights! Looking forward to more posts like this.',
        likes: ['1', '99'],
        repost: [],
        comments: [],
        createdAt: '2025-02-16T11:00:00.000Z',
      },
      {
        _id: 'c3',
        authorId: '99',
        content: 'This is a comment that will be ignored in the UI.',
        likes: [],
        repost: [],
        comments: [],
        createdAt: '2025-02-16T12:00:00.000Z',
      },
      {
        _id: 'c4',
        authorId: '1',
        content: 'Another comment that will be ignored in the UI.',
        likes: [],
        repost: [],
        comments: [],
        createdAt: '2025-02-16T13:00:00.000Z',
      },
    ],
    createdAt: '2025-02-16T11:00:00.000Z',
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

// get user by id
export const getUserById = (userId: string) =>
  USERS.find((u) => u._id === userId);

// get post by id
export const getPostById = (postId: string) =>
  USERS.flatMap((u) => u.posts).find((p) => p._id === postId);

// get posts of a user sorted by newest
export const getPostsByUser = (userId: string) =>
  USERS.find((u) => u._id === userId)?.posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ) || [];

// get authenticated user's feed (posts from followed users + own posts) sorted by newest
export const getFeedPosts = () => {
  const followedUserIds = CURRENT_USER.following;
  const feedPosts = USERS.filter(
    (u) => followedUserIds.includes(u._id) || u._id === CURRENT_USER_ID
  ).flatMap((u) => u.posts);

  return feedPosts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// get auth user
export const getCurrentUser = () => CURRENT_USER;

// get posts sorted by newest
export const getAllPosts = () =>
  USERS.flatMap((u) => u.posts).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

// check if current user liked a post
export const hasLiked = (post: Post) => post.likes.includes(CURRENT_USER_ID);
