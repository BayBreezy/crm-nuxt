<template>
  <!-- Modal used to create contacts -->
  <VueFinalModal
    @update:model-value="
      emits('update:modelValue', $event);
      resetForm({ values: {} as Contact });
    "
    :model-value="modelValue"
    class="flex justify-start"
    overlay-transition="vfm-fade"
    overlay-class="bg-black/50 fixed inset-0 backdrop-blur"
    content-transition="slide">
    <NuxtScrollbar class="h-screen w-screen overflow-y-auto bg-white lg:w-[500px]">
      <div class="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-5">
        <p class="text-lg font-semibold">Create contact</p>
        <button
          type="button"
          @click="
            emits('update:modelValue', false);
            resetForm({ values: {} as Contact });
          "
          class="text-gray-400 transition-colors hover:text-primary-600">
          <Icon size="30" name="solar:close-square-line-duotone" />
        </button>
      </div>

      <form @submit="onSubmit" class="mt-10 px-5">
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormInput name="firstName" label="First name" />
          <FormInput name="lastName" label="Last name" />
        </div>
        <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormInput name="email" label="Email" type="email" />
          <FormInput name="phone" label="Phone" type="tel" />
        </div>
        <div class="mt-5">
          <FormInput name="company" label="Company" />
        </div>
        <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormInput name="position" label="Position" />
          <FormInput name="department" label="Department" />
        </div>
        <div class="mt-5">
          <FormTextarea name="address" label="Address" />
        </div>
        <div class="mt-5">
          <button :disabled="isSubmitting" class="btn btn-primary uppercase" type="submit">
            Submit
          </button>
        </div>
      </form>
    </NuxtScrollbar>
  </VueFinalModal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from "vue-final-modal";
  import { useForm } from "vee-validate";
  import { Contact } from "@prisma/client";

  const props = defineProps<{
    modelValue?: boolean;
  }>();

  const emits = defineEmits<{
    (e: "update:modelValue", arg: boolean): void;
    (e: "refresh"): void;
  }>();

  const open = (c: Contact) => {
    setValues(c);
  };

  const { handleSubmit, isSubmitting, setValues, resetForm } = useForm<Contact>({
    validationSchema: ContactSchema,
  });

  defineExpose({
    open,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await useToast().promise(
        // check if the ID is set and update instead of create
        values.id
          ? $fetch(`/api/contacts/${values.id}`, {
              method: "PUT",
              body: values,
            })
          : $fetch("/api/contacts", {
              method: "POST",
              body: values,
            }),
        {
          error: {
            autoClose: 12000,
            closeButton: true,
            render(err: any) {              
              return useFormatError(err.data);
            },
          },
          pending: "Creating contact...",
          success: {
            autoClose: 5000,
            closeButton: true,
            render(data: any) {
              return values.id ? "Contact updated successfully" : "Contact created successfully!";
            },
          },
        }
      );
      emits("refresh");
      emits("update:modelValue", false);
    } catch (error: any) {
      console.log(error);
    }
  });
</script>
