<template>
  <div>
    <header class="border-b border-gray-100">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <NuxtLink class="font-bold" to="/admin/contacts">CRM</NuxtLink>
        <div>
          <nav>
            <button @click="logout" v-tooltip="`Logout`" class="btn-icon p-1.5">
              <Icon size="22" name="solar:logout-2-line-duotone" />
            </button>
          </nav>
        </div>
      </div>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
  const logout = async () => {
    const { logoutUser } = useAuth();
    await logoutUser();
    await navigateTo("/", { replace: true });
    useToast().success("Logged out successfully");
  };
</script>
