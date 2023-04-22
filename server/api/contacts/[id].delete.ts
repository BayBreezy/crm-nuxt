export default defineEventHandler(async (e) => {
  // verify user
  const user = e.context.user;
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });
  // Get the id from params
  const id = Number(e.context?.params?.id);
  if (!id) throw createError({ statusCode: 400, message: "Bad Request" });
  try {
    // delete notes related to the contact
    await prisma.notes.deleteMany({
      where: { contactId: id },
    });
    // delete contact
    await prisma.contact.delete({
      where: { id },
    });
    // return contact
    return "Contact deleted successfully";
  } catch (error: any) {
    throw createError({ statusCode: 400, message: error.message });
  }
});
