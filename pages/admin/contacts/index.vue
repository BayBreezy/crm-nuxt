<template>
  <div class="mx-auto max-w-6xl p-5">
    <h1 class="text-3xl font-semibold">Contacts</h1>
    <div class="mt-7 flex items-center gap-5">
      <button @click="exportContacts" class="btn btn-outline">
        <Icon size="18" name="solar:cloud-download-line-duotone" /> Export All
      </button>
      <button @click="contactModal = true; contactRef.open({})" class="btn btn-primary">Create New</button>
    </div>

    <ContactModal ref="contactRef" @refresh="refreshContacts" v-model="contactModal" />

    <div class="mt-10">
      <DataTable
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
            <button class="btn-icon p-1.5" v-tooltip="`Add note`" type="button">
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
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Contact } from "@prisma/client";
  import type { Header } from "vue3-easy-data-table";
  definePageMeta({ layout: "admin" });

  const contactRef = ref();
  let contactModal = ref(false);

  const {
    data: contacts,
    refresh: refreshContacts,
    pending,
  } = await useFetch("/api/contacts", {
    default: () => [],
  });

  // table headers fro contact table
  const headers: Header[] = [
    { text: "Name", value: "name" },
    { text: "Phone", value: "phone" , sortable: true},
    { text: "Company", value: "company", sortable: true},
    { text: "Position", value: "position", sortable: true },
    { text: "Department", value: "department", sortable: true },
    { text: "Address", value: "address" },
    { text: "Actions", value: "actions" },
  ];

  /**
   * Method used to delete contact
   * @param id contact id
   */
  const deleteContact = async (id: string) => {
    await useToast().promise(
      $fetch(`/api/contacts/${id}`, {
        method: "DELETE",
      }),
      {
        error: {
          autoClose: 12000,
          closeButton: true,
          render(err: any) {
            return useFormatError(err);
          },
        },
        pending: "Deleting contact...",
        success: {
          autoClose: 12000,
          closeButton: true,
          render() {
            return "Contact deleted successfully";
          },
        },
      }
    );
    await refreshContacts();
  };

const setEdit = (contact: Contact) => {
  contactModal.value = true;
  contactRef.value?.open(JSON.parse(JSON.stringify(contact)));
  };

  // Export all contacts
  const exportContacts = async () => {
    const data = await useToast().promise($fetch("/api/contacts/export"), {
      error: {
        autoClose: 12000,
        closeButton: true,
        render(err: any) {
          return useFormatError(err);
        },
      },
      pending: "Exporting contacts...",
      success: {
        autoClose: 12000,
        closeButton: true,
        render() {
          return "Contacts exported successfully";
        },
      },
    });
    if (data) {
      // download file from base64 string
      const bytes = atob(data)
        .split("")
        .map((char) => char.charCodeAt(0));
      const byteArray = new Uint8Array(bytes);
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "contacts.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
</script>
