export default defineNuxtPlugin(async (app) => {
  const { getMe } = useAuth();
  await getMe();
});
