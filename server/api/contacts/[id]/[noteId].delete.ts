export default defineEventHandler(async (e) => {
  // verify user
  const user = e.context.user;
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });
  // Get the noteid from params
  const noteid = Number(e.context?.params?.noteId);
  if (!noteid) throw createError({ statusCode: 400, message: "Bad Request" });
  try {
    // delete note
    await prisma.notes.delete({
      where: { id: noteid },
    });
    // return response
    return "Note deleted successfully";
  } catch (error: any) {
    throw createError({ statusCode: 400, message: error.message });
  }
});
