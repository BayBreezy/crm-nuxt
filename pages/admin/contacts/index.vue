<template>
  <div class="mx-auto max-w-6xl p-5">
    <h1 class="text-3xl font-semibold">Contacts</h1>
    <div class="mt-7 md:flex md:items-start md:justify-between">
      <div>
        <FormInput
          type="search"
          icon="ph:magnifying-glass"
          name="search"
          placeholder="Search"
          v-model="search" />
      </div>
      <div class="flex items-center gap-5">
        <button @click="exportContacts()" class="btn btn-outline">
          <Icon size="18" name="solar:cloud-download-line-duotone" /> Export All
        </button>
        <button
          @click="
            contactModal = true;
            contactRef.open({});
          "
          class="btn btn-primary">
          Create New
        </button>
      </div>
    </div>

    <ContactModal ref="contactRef" @refresh="refreshContacts" v-model="contactModal" />
    <NotesModal ref="notesRef" />

    <div class="mt-10">
      <ClientOnly>
        <DataTable
          :search-value="search"
          theme-color="#22c55e"
          table-class-name="dt"
          :items="contacts"
          :loading="pending"
          :headers="headers">
          <!-- Template used to render contact name and email -->
          <template #item-name="{ firstName, lastName, email }">
            <div class="my-3">
              <p class="text-sm font-semibold">{{ firstName }} {{ lastName }}</p>
              <a class="text-primary" :href="`mailto:${email}`">{{ email }}</a>
            </div>
          </template>
          <!-- Template used to render action buttons -->
          <template #item-actions="item">
            <div class="flex items-center gap-1">
              <!-- Edit button -->
              <button
                @click="setEdit(item)"
                class="btn-icon p-1.5"
                v-tooltip="`Edit contact`"
                type="button">
                <Icon size="20" name="solar:pen-new-square-line-duotone" />
              </button>
              <!-- Add note button -->
              <button
                @click="notesRef?.open(item)"
                class="btn-icon p-1.5"
                v-tooltip="`Add note`"
                type="button">
                <Icon size="20" name="solar:notebook-line-duotone" />
              </button>
              <!-- Delete button -->
              <VDropdown>
                <button class="btn-icon p-1.5" v-tooltip="`Remove contact`" type="button">
                  <Icon size="20" name="solar:trash-bin-minimalistic-line-duotone" />
                </button>
                <template #popper="{ hide }">
                  <div class="p-5">
                    <p class="mb-2 text-sm">Are you sure you want to delete?</p>
                    <div class="mt-3 flex items-center gap-2">
                      <button
                        @click="
                          deleteContact(item.id);
                          hide();
                        "
                        class="rounded border px-2 py-1 font-semibold hover:text-primary">
                        Yes
                      </button>
                      <button
                        class="rounded border px-2 py-1 font-semibold hover:text-primary"
                        @click="hide()">
                        No
                      </button>
                    </div>
                  </div>
                </template>
              </VDropdown>
            </div>
          </template>
        </DataTable>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Contact } from "@prisma/client";
  import { NotesModal } from "#components";

  // Tell the page which layout to use
  definePageMeta({ layout: "admin" });

  // Ref for contact modal
  const contactRef = ref();
  // var used to open close the contact modal
  let contactModal = ref(false);
  // Ref for notes modal
  const notesRef = ref<InstanceType<typeof NotesModal>>();
  // var used to hold search value
  let search = ref("");

  const {
    data: contacts,
    refresh: refreshContacts,
    pending,
  } = await useFetch("/api/contacts", {
    default: () => [],
  });

  const setEdit = (contact: Contact) => {
    contactModal.value = true;
    contactRef.value?.open(JSON.parse(JSON.stringify(contact)));
  };

  // headers used in the datatable
  const headers = useContactHeaders;
  // function used to delete contact
  const deleteContact = async (id: string) => {
    await useDeleteContact(id);
    await refreshContacts();
  };
  // function used to export contacts
  const exportContacts = useExportContacts;
</script>
