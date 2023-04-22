export default defineEventHandler(async (e) => {
  const user = e.context.user;
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

  return await prisma.contact.findMany({
    where: { userId: user.id },
  });
});
