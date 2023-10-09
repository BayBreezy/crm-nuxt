// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  devtools: { enabled: true },
  typescript: { shim: false },
  css: [
    "vue3-easy-data-table/dist/style.css",
    "vue-final-modal/style.css",
    "@/assets/css/datatables.css",
    "~/assets/css/main.css",
  ],

  modules: [
    "@nuxtjs/device",
    "nuxt-icon",
    "nuxt-headlessui",
    "nuxt-typed-router",
    "@morev/vue-transitions/nuxt",
    "@vueuse/nuxt",
    "@davestewart/nuxt-scrollbar",
  ],

  headlessui: {
    prefix: "H",
  },

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "page", mode: "out-in" },
    head: {
      title: "CRM",
      link: [
        { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
        { rel: "preconnect", href: "https://rsms.me/" },
      ],
    },
  },
});
