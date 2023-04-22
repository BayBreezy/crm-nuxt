import { autoAnimatePlugin, useAutoAnimate } from "@formkit/auto-animate/vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(autoAnimatePlugin);
  return {
    provide: {
      useAutoAnimate,
    },
  };
});
