import Vue3Toastify, { ToastOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 8000,
    bodyClassName: "!text-sm",
  } as ToastOptions);
});
