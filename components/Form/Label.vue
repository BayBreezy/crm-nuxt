<template>
  <label class="mb-1.5 block cursor-pointer text-sm font-medium text-slate-700">
    <slot />
  </label>
</template>

<script setup lang="ts">
  interface ILabel extends /* @vue-ignore */ Partial<HTMLLabelElement> {}
  defineProps<ILabel>();
</script>
