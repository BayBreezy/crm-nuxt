<template>
  <div>
    <FormLabel v-if="label" :html-for="id">{{ label }}</FormLabel>
    <div class="relative">
      <textarea
        :class="[errorMessage ? 'input-error' : '']"
        :id="id"
        rows="3"
        :name="name"
        v-model="value"
        @blur="handleBlur"
        @change="handleChange"
        @input="handleChange"
        v-bind="$attrs" />
      <p class="mt-1 select-none text-xs text-slate-500 dark:text-slate-400">
        &nbsp;
        <transition-slide group :offset="[0, '100%']">
          <span v-if="hint && !errorMessage">{{ hint }}</span>
          <span v-if="errorMessage" class="text-red-500">{{ errorMessage }}</span>
        </transition-slide>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script setup lang="ts">
  import { useField } from "vee-validate";
  interface IInput extends /* @vue-ignore */ Partial<HTMLTextAreaElement> {
    name: string;
    rules?: any;
    label?: string;
    modelValue?: any;
    hint?: string;
    id?: any;
  }

  const props = withDefaults(defineProps<IInput>(), {});

  const { value, errorMessage, handleBlur, handleChange } = useField(ref(props.name), props.rules, {
    initialValue: props.modelValue,
    label: props.label,
    validateOnValueUpdate: true,
  });
</script>
