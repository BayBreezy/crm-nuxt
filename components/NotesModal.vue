<template>
  <!-- Modal used to view notes -->
  <VueFinalModal
    v-model="dialog"
    class="flex justify-start"
    overlay-transition="vfm-fade"
    overlay-class="bg-black/50 fixed inset-0 backdrop-blur"
    content-transition="slide"
    content-class="w-full">
    <NuxtScrollbar class="h-screen w-screen max-w-[700px] bg-white">
      <div class="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-5">
        <p class="text-lg font-semibold">Contact notes</p>
        <button
          type="button"
          @click="dialog = false"
          class="text-gray-400 transition-colors hover:text-primary-600">
          <Icon size="30" name="solar:close-square-line-duotone" />
        </button>
      </div>
      <div class="p-5">
        <!-- Form for updating/creating note -->
        <form @submit="onSubmit">
          <FormTextarea name="content" label="Note" />
          <div class="mt-2">
            <button type="submit" class="btn btn-primary uppercase">Submit</button>
          </div>
        </form>

        <!-- List of notes -->
        <div class="mt-5" v-if="notes && notes.length > 0">
          <p class="text-sm text-gray-500">Notes</p>

          <ul class="mt-6 space-y-5">
            <template v-for="n in notes" :key="n.id">
              <li class="flex items-start justify-between rounded-lg border p-5">
                <div class="grow">
                  <p class="line-clamp-3 whitespace-pre-line">{{ n.content }}</p>
                  <small class="text-xs text-gray-500">{{
                    dayjs(n.createdAt).format("ddd, MMM DD, YYYY @ h:mm A")
                  }}</small>
                </div>
                <div class="flex shrink-0 items-center gap-2">
                  <button
                    @click="setValues(n)"
                    class="btn-icon p-1.5"
                    v-tooltip="`Edit note`"
                    type="button">
                    <Icon size="20" name="solar:pen-new-square-line-duotone" />
                  </button>
                  <!-- Delete button -->
                  <VDropdown>
                    <button class="btn-icon p-1.5" v-tooltip="`Remove note`" type="button">
                      <Icon size="20" name="solar:trash-bin-minimalistic-line-duotone" />
                    </button>
                    <template #popper="{ hide }">
                      <div class="p-5">
                        <p class="mb-2 text-sm">Are you sure you want to delete?</p>
                        <div class="mt-3 flex items-center gap-2">
                          <button
                            @click="
                              deleteNote(n.id);
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
              </li>
            </template>
          </ul>
        </div>
      </div>
    </NuxtScrollbar>
  </VueFinalModal>
</template>

<script setup lang="ts">
  import dayjs from "dayjs";
  import { Contact, Notes } from "@prisma/client";
  import { VueFinalModal } from "vue-final-modal";
  import { useForm } from "vee-validate";

  // open/close state of the modal
  const dialog = ref();

  // current contact
  const contact = ref<Contact>();
  const notes = ref<Notes[]>([]);
  let currentNote = ref<Notes>();

  const { handleSubmit, setValues, resetForm } = useForm({
    initialValues: currentNote.value,
    validationSchema: NoteSchema,
  });

  // function used to delete a note
  const deleteNote = async (id: string | number) => {
    await useToast().promise(
      $fetch(`/api/contacts/${contact.value?.id}/${id}`, {
        method: "DELETE",
      }),
      {
        pending: "Deleting note...",
        success: {
          autoClose: 12000,
          closeButton: true,
          render() {
            return "Note deleted successfully!";
          },
        },
        error: {
          autoClose: 12000,
          closeButton: true,
          render(err) {
            return useFormatError(err.data);
          },
        },
      }
    );
    // load notes
    notes.value = await useGetContactNotes(contact.value?.id!);
  };

  const onSubmit = handleSubmit(async (values) => {
    await useToast().promise(
      values?.id
        ? $fetch(`/api/contacts/${contact.value?.id}/${values.id}`, {
            method: "PUT",
            body: values,
          })
        : $fetch(`/api/contacts/${contact.value?.id}/notes`, {
            method: "POST",
            body: values,
          }),
      {
        pending: "Saving note...",
        success: {
          autoClose: 12000,
          closeButton: true,
          render() {
            return values.id ? "Note updated successfully" : "Note saved successfully!";
          },
        },
        error: {
          autoClose: 12000,
          closeButton: true,
          render(err) {
            return useFormatError(err.data);
          },
        },
      }
    );
    // load notes
    notes.value = await useGetContactNotes(contact.value?.id!);
    resetForm();
  });
  // function to open the modal & load notes for the given contact
  const open = async (c?: Contact) => {
    if (c) {
      contact.value = c;
      // load notes
      notes.value = await useGetContactNotes(c.id);
    }
    dialog.value = true;
  };
  // expose the open function to the parent component
  defineExpose({ open });
</script>
