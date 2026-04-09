import { defineStore } from 'pinia';

export interface ProfileUser {
  _id: string;
  username: string;
  email?: string;
  bio?: string;
  link?: string;
  profileImg?: string;
  coverImg?: string;
  followers?: string[];
  following?: string[];
  likedPosts?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ProfileState {
  profile: ProfileUser | null;
  loading: boolean;
  error: string | null;
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    profile: null,
    loading: false,
    error: null,
  }),

  getters: {
    hasProfile: (state) => !!state.profile?._id,
  },

  actions: {
    async fetchProfile(username: string) {
      if (!username) return;

      const api = useApiClient();

      this.loading = true;
      this.error = null;

      try {
        this.profile = await api.get<ProfileUser>(
          `/user/profile/${encodeURIComponent(username)}`,
        );
      } catch (error: any) {
        this.profile = null;
        this.error = error?.message || 'Failed to fetch profile';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearProfile() {
      this.profile = null;
    },

    clearError() {
      this.error = null;
    },

    reset() {
      this.profile = null;
      this.loading = false;
      this.error = null;
    },
  },
});
