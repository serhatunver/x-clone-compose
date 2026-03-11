import { defineStore } from 'pinia';
import { useUserStore } from './user';

export interface Post {
  _id: string;
  user: string;
  content: string;
  image?: string | null;
  replyTo?: string | null;
  likes: string[];
  reposts: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
}

interface PostsState {
  posts: Post[];
  userPosts: Post[];
  post: Post | null;
  loading: boolean;
  error: string | null;
}

export const usePostsStore = defineStore('posts', {
  state: (): PostsState => ({
    posts: [],
    userPosts: [],
    post: null,
    loading: false,
    error: null,
  }),

  getters: {
    hasPosts: (state) => state.posts.length > 0,
    hasUserPosts: (state) => state.userPosts.length > 0,
  },

  actions: {
    getAuthHeaders() {
      const { token } = useAuth();

      return {
        Accept: 'application/json',
        ...(token.value ? { Authorization: `${token.value}` } : {}),
      };
    },

    getApiBase() {
      const config = useRuntimeConfig();
      return config.public.apiBase;
    },

    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      const apiBase = this.getApiBase();

      const res = await fetch(`${apiBase}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...(options.headers || {}),
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || 'Request failed');
      }

      return res.json();
    },

    async fetchPosts() {
      this.loading = true;
      this.error = null;

      try {
        const posts = await this.request<Post[]>('/post/all', {
          method: 'GET',
        });

        this.posts = posts;
      } catch (error: any) {
        this.error = error?.message || 'Failed to fetch posts';
        console.error('Fetch posts error:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchPost(postId: string) {
      if (!postId) return;

      this.loading = true;
      this.error = null;

      try {
        const post = await this.request<Post>(
          `/post/${encodeURIComponent(postId)}`,
          {
            method: 'GET',
          },
        );

        this.post = post;
      } catch (error: any) {
        this.error = error?.message || 'Failed to fetch post';
        console.error('Fetch post error:', error);
        this.post = null;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserPosts(username: string) {
      if (!username) return;

      this.loading = true;
      this.error = null;

      try {
        const userPosts = await this.request<Post[]>(
          `/post/user/${encodeURIComponent(username)}`,
          {
            method: 'GET',
          },
        );

        this.userPosts = userPosts;
      } catch (error: any) {
        this.error = error?.message || 'Failed to fetch user posts';
        console.error('Fetch user posts error:', error);
        this.userPosts = [];
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deletePost(postId: string) {
      if (!postId) return;

      this.loading = true;
      this.error = null;

      try {
        await this.request<void>(`/post/${encodeURIComponent(postId)}`, {
          method: 'DELETE',
        });

        this.posts = this.posts.filter((post) => post._id !== postId);
        this.userPosts = this.userPosts.filter((post) => post._id !== postId);

        if (this.post?._id === postId) {
          this.post = null;
        }

        const userStore = useUserStore();
        const username = userStore.user?.username;

        await this.fetchPosts();

        if (username) {
          await this.fetchUserPosts(username);
        }
      } catch (error: any) {
        this.error = error?.message || 'Failed to delete post';
        console.error('Delete post error:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearPost() {
      this.post = null;
    },

    clearPostsError() {
      this.error = null;
    },

    resetPostsState() {
      this.posts = [];
      this.userPosts = [];
      this.post = null;
      this.loading = false;
      this.error = null;
    },
  },
});
