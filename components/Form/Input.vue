<template>
  <div>
    <FormLabel v-if="label" :htmlFor="label">{{ label }}</FormLabel>
    <div class="relative">
      <div
        v-if="icon"
        class="pointer-events-none absolute left-3.5 top-3 inline-flex items-center text-slate-400 dark:text-slate-500">
        <Icon size="18" :name="icon" />
      </div>
      <input
        :type="type"
        :id="label"
        :class="[errorMessage ? 'input-error' : '', icon ? 'pl-11' : '']"
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

  interface IInput extends /* @vue-ignore */ Partial<HTMLInputElement> {
    type?: string;
    name: string;
    rules?: any;
    label?: string;
    modelValue?: any;
    hint?: string;
    icon?: string;
    validateOnMount?: boolean;
  }

  const props = withDefaults(defineProps<IInput>(), {
    type: "text",
  });

  const { value, errorMessage, handleBlur, handleChange } = useField(ref(props.name), props.rules, {
    initialValue: props.modelValue,
    validateOnValueUpdate: true,
    validateOnMount: props.validateOnMount,
  });
</script>
