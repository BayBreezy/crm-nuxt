<template>
  <div>
    <header class="border-b border-gray-100">
      <div class="mx-auto px-5 flex h-16 max-w-6xl items-center justify-between">
        <NuxtLink class="font-bold" to="/admin/contacts">CRM</NuxtLink>
        <div>
          <nav>
            <NuxtLink class="btn btn-ghost" to="/admin/contacts">Contacts</NuxtLink>
          </nav>
        </div>
      </div>
    </header>
    <main >
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts"></script>
