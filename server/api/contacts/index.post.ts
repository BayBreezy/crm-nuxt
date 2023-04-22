import { Contact } from "@prisma/client";
import { ContactSchema } from "@/utils/validations";

export default defineEventHandler(async (e) => {
  const user = e.context.user;
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });
  const body = await readBody<Contact>(e);
  try {
    // validate request body
    await ContactSchema.validate(body);
    // check if the contact is already there
    const contactExist = await prisma.contact.findUnique({ where: { email: body.email } });
    if (contactExist) throw createError({ statusCode: 400, message: "Contact already exist" });
    // create contact
    const contact = await prisma.contact.create({
      data: {
        ...body,
        userId: user.id,
      },
    });
    // return contact
    return contact;
  } catch (error: any) {
    throw createError({ statusCode: 400, message: error.message });
  }
});
