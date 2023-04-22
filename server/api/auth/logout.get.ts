export default defineEventHandler(async (e) => {
  try {
    // create http only cookie with token
    setCookie(e, process.env.COOKIE_NAME!, "", {
      httpOnly: true,
      maxAge: -1,
      sameSite: "strict",
    });
    return true;
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
