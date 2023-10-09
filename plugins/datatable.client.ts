import Vue3EasyDataTable from "vue3-easy-data-table";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("DataTable", Vue3EasyDataTable);
});
