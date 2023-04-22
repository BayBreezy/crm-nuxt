import { Notes } from "@prisma/client";
import { NoteSchema } from "@/utils/validations";

export default defineEventHandler(async (e) => {
  const user = e.context.user;
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });
  // Get the id from params
  const id = Number(e.context?.params?.id);
  if (!id) throw createError({ statusCode: 400, message: "Bad Request" });
  const body = await readBody<Notes>(e);
  try {
    // validate request body
    await NoteSchema.validate(body);
    // check if the contact exist
    const contact = await prisma.contact.findUnique({ where: { id } });
    if (!contact) throw createError({ statusCode: 400, message: "Contact does not exist" });
    // create note
    const note = await prisma.notes.create({
      data: {
        ...body,
        contactId: contact.id,
      },
    });
    // return note
    return note;
  } catch (error: any) {
    throw createError({ statusCode: 400, message: error.message });
  }
});
