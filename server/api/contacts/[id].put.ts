import { Contact } from "@prisma/client";
import { ContactSchema } from "@/utils/validations";

export default defineEventHandler(async (e) => {
  // verify user
  const user = e.context.user;
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });
  // Get the id from params
  const id = Number(e.context?.params?.id);
  if (!id) throw createError({ statusCode: 400, message: "Bad Request" });
  // get update body
  const body = await readBody<Partial<Contact>>(e);
  try {
    // validate request body
    const values = await ContactSchema.validate(body, { stripUnknown: true });
    // create contact
    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...values,
        userId: user.id,
      },
    });
    // return contact
    return contact;
  } catch (error: any) {
    console.log(error);

    throw createError({ statusCode: 400, message: error.message });
  }
});
