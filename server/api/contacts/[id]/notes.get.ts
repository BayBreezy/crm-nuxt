export default defineEventHandler(async (e) => {
  // verify user
  const user = e.context.user;
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });
  // Get the id from params
  const id = Number(e.context?.params?.id);
  if (!id) throw createError({ statusCode: 400, message: "Bad Request" });
  try {
    // get the notes base on the contact id
    const notes = await prisma.contact.findFirst({ where: { id } }).notes();
    // return notes
    return notes;
  } catch (error: any) {
    throw createError({ statusCode: 400, message: error.message });
  }
});
