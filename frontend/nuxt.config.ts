import { ref } from 'vue';
// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  ssr: false, // have to be false for auth to work
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
  auth: {
    isEnabled: true,
    baseURL: 'http://localhost:3000/api/v1/auth',
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
        maxAgeInSeconds: 60 * 60 * 24,
        sameSiteAttribute: 'strict',
        cookieDomain: 'localhost',
        secureCookieAttribute: true,
        httpOnlyCookieAttribute: false,
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
      addDefaultCallbackUrl: false,
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
