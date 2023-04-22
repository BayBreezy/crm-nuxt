import { AuthSchema } from "@/utils/validations";

export default defineEventHandler(async (e) => {
  const { email, password } = await readBody(e);

  try {
    // validate email and password
    await AuthSchema.validate({ email, password });
    // check if account already exist
    const accountExist = await prisma.user.findUnique({ where: { email } });
    if (accountExist) {
      throw createError({
        statusCode: 400,
        message: "This email is taken",
      });
    }
    // hash password
    const hashedPassword = await hashString(password);
    // create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    // create jwt token
    const token = await createToken(user);
    // create http only cookie with token
    setCookie(e, process.env.COOKIE_NAME!, token!, {
      httpOnly: true,
      maxAge: Number(process.env.JWT_EXP_SEC),
      sameSite: "strict",
    });
    // send response
    return user;
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
