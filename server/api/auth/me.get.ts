export default defineEventHandler((e) => {
  // get user from handler event
  const user = e.context.user;
  return user || {};
});
