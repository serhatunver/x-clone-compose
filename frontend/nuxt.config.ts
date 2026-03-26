import { ref } from 'vue';
// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  devServer: {
    port: 5173,
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@sidebase/nuxt-auth',
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL,
    },
  },
  auth: {
    isEnabled: true,
    disableServerSideAuth: false,
    baseURL: process.env.NUXT_PUBLIC_API_BASE_URL + '/auth',
    provider: {
      type: 'local',
      pages: {
        login: '/login',
      },
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        signUp: { path: '/register', method: 'post' },
        getSession: { path: '/me', method: 'get' },
      },
      token: {
        signInResponseTokenPointer: '/token',
        type: 'Bearer',
        cookieName: 'auth.token',
        headerName: 'Authorization',
        maxAgeInSeconds: 60 * 60,
        sameSiteAttribute: 'strict',
        cookieDomain:
          process.env.NODE_ENV === 'production'
            ? process.env.COOKIE_DOMAIN
            : 'localhost',
        secureCookieAttribute: true,
        httpOnlyCookieAttribute: true,
      },
      session: {
        dataType: {
          userId: 'string',
          username: 'string',
          following: 'array',
          followers: 'array',
          profileImg: 'string',
        },
        dataResponsePointer: '/',
      },
    },
    sessionRefresh: {
      enablePeriodically: false,
      enableOnWindowFocus: true,
    },
    globalAppMiddleware: {
      isEnabled: true,
      addDefaultCallbackUrl: true,
    },
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },
});
