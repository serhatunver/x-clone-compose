const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

export const useUserStore = defineStore('user', {
  state: (): IState => ({
    user: null as IUser | null,
    isLoading: false,
  }),
  persist: false,
  getters: {
    isAuthenticated: (state: IState) => !!state.user?._id,
  },
  actions: {
    async fetchUser(username: string) {
      try {
        const { token } = useAuth();
        const res = await fetch(`${apiBase}/user/profile/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token.value || '',
          },
        });

        const user = await res.json();

        this.user = user;
      } catch (error) {
        console.error('Fetch posts error:', error);
      }
    },
  },
});

interface IUser {
  _id: string;
  username: string;
}

interface IState {
  user: IUser | null;
  isLoading: boolean;
}
