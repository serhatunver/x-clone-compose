import { defineStore } from 'pinia';

export interface Post {
  _id: string;
  user: string;
  content: string;
  image?: string | null;
  replyTo?: string | null;
  likes: string[];
  reposts: string[];
  comments: Post[];
  createdAt: string;
  updatedAt: string;
}

interface PostsState {
  posts: Post[];
  userPosts: Post[];
  selectedPost: Post | null;
  loading: boolean;
  error: string | null;
}

export const usePostsStore = defineStore('posts', {
  state: (): PostsState => ({
    posts: [],
    userPosts: [],
    selectedPost: null,
    loading: false,
    error: null,
  }),

  getters: {
    hasPosts: (state) => state.posts.length > 0,
    hasUserPosts: (state) => state.userPosts.length > 0,
    hasSelectedPost: (state) => !!state.selectedPost?._id,
  },

  actions: {
    async fetchPosts() {
      const api = useApiClient();

      this.loading = true;
      this.error = null;

      try {
        this.posts = await api.get<Post[]>('/post/all');
      } catch (error: any) {
        this.error = error?.message || 'Failed to fetch posts';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchPost(postId: string) {
      if (!postId) return;

      const api = useApiClient();

      this.loading = true;
      this.error = null;

      try {
        this.selectedPost = await api.get<Post>(
          `/post/${encodeURIComponent(postId)}`,
        );
      } catch (error: any) {
        this.selectedPost = null;
        this.error = error?.message || 'Failed to fetch post';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserPosts(username: string) {
      if (!username) return;

      const api = useApiClient();

      this.loading = true;
      this.error = null;

      try {
        this.userPosts = await api.get<Post[]>(
          `/post/user/${encodeURIComponent(username)}`,
        );
      } catch (error: any) {
        this.userPosts = [];
        this.error = error?.message || 'Failed to fetch user posts';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deletePost(postId: string, username?: string) {
      if (!postId) return;

      const api = useApiClient();

      this.loading = true;
      this.error = null;

      try {
        await api.del<void>(`/post/${encodeURIComponent(postId)}`);

        this.posts = this.posts.filter((post) => post._id !== postId);
        this.userPosts = this.userPosts.filter((post) => post._id !== postId);

        if (this.selectedPost?._id === postId) {
          this.selectedPost = null;
        }

        await this.fetchPosts();

        if (username) {
          await this.fetchUserPosts(username);
        }
      } catch (error: any) {
        this.error = error?.message || 'Failed to delete post';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearSelectedPost() {
      this.selectedPost = null;
    },

    clearError() {
      this.error = null;
    },

    reset() {
      this.posts = [];
      this.userPosts = [];
      this.selectedPost = null;
      this.loading = false;
      this.error = null;
    },
  },
});
