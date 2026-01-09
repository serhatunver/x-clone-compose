export interface Post {
  id: string;
  user: string;
  content: string;
  image: string;
  replyTo: string;
  likes: Array<string>;
  reposts: Array<string>;
  comments: Array<string>;
  created_at: string;
  updated_at: string;
}

interface PostsState {
  posts: Post[];
  userPosts: Post[];
  post: Post | null;
  loading: boolean;
}

import { useUserStore } from './user';

export const usePostsStore = defineStore('posts', {
  state: (): PostsState => ({
    posts: [],
    userPosts: [],
    post: null,
    loading: true,
  }),

  actions: {
    async fetchPosts() {
      this.loading = true;
      try {
        const { token } = useAuth();
        const res = await fetch('http://localhost:3000/api/v1/post/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token.value || '',
          },
        });

        const posts = await res.json();

        this.posts = posts;
      } catch (error) {
        console.error('Fetch posts error:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchPost(postId: string) {
      this.loading = true;
      try {
        const { token } = useAuth();
        const res = await fetch(`http://localhost:3000/api/v1/post/${postId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token.value || '',
          },
        });

        const post = await res.json();
        this.post = post;
      } catch (error) {
        console.error('Fetch post error:', error);
      } finally {
        this.loading = false;
      }
    },
    async deletePost(postId: string) {
      this.loading = true;
      try {
        const { token } = useAuth();
        const res = await fetch(`http://localhost:3000/api/v1/post/${postId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token.value || '',
          },
        });

        if (res.ok) {
          this.fetchPosts();
          this.fetchUserPosts(useUserStore().user.username);
          this.fetchPost(this.post._id);
        }
      } catch (error) {
        console.error('Delete post error:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchUserPosts(username: string) {
      this.loading = true;
      try {
        const { token } = useAuth();
        const res = await fetch(
          `http://localhost:3000/api/v1/post/user/${username}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token.value || '',
            },
          },
        );

        const userPosts = await res.json();
        this.userPosts = userPosts;
      } catch (error) {
        console.error('Fetch user posts error:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
