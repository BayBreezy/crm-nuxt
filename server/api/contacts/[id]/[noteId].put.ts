import { Notes } from "@prisma/client";
import { NoteSchema } from "@/utils/validations";

export default defineEventHandler(async (e) => {
  // verify user
  const user = e.context.user;
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });
  // Get the contactid from params
  const contactid = Number(e.context?.params?.id);
  if (!contactid) throw createError({ statusCode: 400, message: "Bad Request" });
  // Get the noteid from params
  const noteid = Number(e.context?.params?.noteId);
  if (!noteid) throw createError({ statusCode: 400, message: "Bad Request" });
  // get update body
  const body = await readBody<Partial<Notes>>(e);
  try {
    // validate request body
    const values = await NoteSchema.validate(body, { stripUnknown: true });
    // update note
    const note = await prisma.notes.update({
      where: { id: noteid },
      data: {
        ...values,
      },
    });
    // return note
    return note;
  } catch (error: any) {
    throw createError({ statusCode: 400, message: error.message });
  }
});
