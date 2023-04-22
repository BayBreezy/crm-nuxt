export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useUser();
  // check if the user is logged in
  if (user.value && (to.path == "/" || to.path == "/register")) {
    return await navigateTo("/admin/contacts");
  }
  // check if the user is not logged in
  if (!user.value && to.path.match(/^\/admin\//gi)) {
    return await navigateTo("/");
  }
});
