<template>
  <main class="flex h-[100dvh] items-center justify-center">
    <div class="p-5 lg:w-[400px]">
      <h1 class="font-bold lg:text-4xl">Create account</h1>
      <p class="mt-5 text-gray-500 lg:text-xl">Enter your email & password</p>
      <form @submit="onSubmit" class="mt-10">
        <div>
          <FormInput label="Email" type="email" name="email" placeholder="Enter your email" />
        </div>
        <div>
          <FormInput
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password" />
        </div>
        <div class="mt-5">
          <button :disabled="isSubmitting" class="btn btn-primary w-full uppercase">
            Create account
          </button>
          <p class="mt-7 text-sm">
            <NuxtLink to="/"
              >Already have an account?
              <span class="font-medium text-primary">Sign in</span></NuxtLink
            >
          </p>
        </div>
      </form>
    </div>
  </main>
</template>

<script lang="ts" setup>
  import { useForm } from "vee-validate";
  import { TAuth } from "~/types";

  const { handleSubmit, isSubmitting } = useForm<TAuth>({
    validationSchema: AuthSchema,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { register } = useAuth();
      await useToast().promise(register(values), {
        pending: "Creating account for you. Please wait...",
        success: {
          autoClose: 12000,
          closeButton: true,
          render() {
            navigateTo("/admin/contacts");
            return "Account created successfully";
          },
        },
        error: {
          autoClose: 12000,
          closeButton: true,
          render(err: any) {
            return useFormatError(err.data);
          },
        },
      });
    } catch (error: any) {
      console.log(error);
    }
  });
</script>
