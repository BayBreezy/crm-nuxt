export default defineEventHandler(async (event) => {
  // get cookies from the event
  const token = getCookie(event, process.env.COOKIE_NAME!);

  if (token) {
    // if there is a token, verify it
    const decoded = await verifyToken(token);
    if (decoded) {
      // get the user by id
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      // if the token is valid, set the user in the event
      event.context.user = user;
    }
  }

  // check if the route being accessed is protected
  const protectedRegex = /\/admin\//gi;
  const isProtected = event.node.req.url && protectedRegex.test(event.node.req.url);
  if (isProtected && !event.context.user) {
    // if the route is protected and the user is not set, throw an error
    return createError({ statusCode: 401, message: "Unauthorized" });
  }
});
