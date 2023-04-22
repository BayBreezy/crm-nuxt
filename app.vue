<template>
  <div class="bg-white text-slate-800">
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
  useHead({
    bodyAttrs: {
      class: "bg-white text-slate-800",
    },
  });
</script>
