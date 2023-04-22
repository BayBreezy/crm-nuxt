import { Notes } from "@prisma/client";
import type { Header } from "vue3-easy-data-table";

// table headers fro contact table
export const useContactHeaders: Header[] = [
  { text: "Name", value: "name" },
  { text: "Phone", value: "phone", sortable: true },
  { text: "Company", value: "company", sortable: true },
  { text: "Department", value: "department", sortable: true },
  { text: "Actions", value: "actions" },
];

// Export all contacts
export const useExportContacts = async () => {
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

// get notes for specified Contact
export const useGetContactNotes = async (id: number) => {
  const res = await $fetch<Notes[]>(`/api/contacts/${id}/notes`);
  return res;
};
// Delete contact
export const useDeleteContact = async (id: string) => {
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
};
