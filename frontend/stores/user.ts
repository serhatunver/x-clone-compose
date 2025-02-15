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
      console.log('fetchUser ~ username:', username);
      try {
        const { token } = useAuth();
        const res = await fetch(
          `http://localhost:3000/api/v1/user/profile/${username}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token.value || '',
            },
          }
        );

        const user = await res.json();
        console.log('fetchUser ~ user:', user);

        this.user = user;

        console.log('fetchUser ~ this.user:', this.user);
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
