import type { User } from "@prisma/client";
import type { TAuth } from "~/types";

export const useUser = () => useState<User | undefined>("CRM_USER");
export const useAuth = () => {
  const user = useUser();

  // document this function
  /**
   * Method to register a new user
   * @param data {TAuth} - The user data to register
   * @returns {Promise<User>} - The response from the API
   * @example
   * const { register } = useAuth()
   * const data = {
   * email: "janedoe@example.com"
   * password: "123456789"
   * }
   * const response = await register(data)
   * console.log(response)
   *
   */
  const register = async (data: TAuth) => {
    try {
      const res = await $fetch<User | undefined>("/api/auth/register", {
        method: "POST",
        body: data,
      });
      user.value = res;
      return res;
    } catch (error: any) {
      throw error.data;
    }
  };
  /**
   * Method to login a user
   * @param data {TAuth} - The user data to login
   * @returns {Promise<User>} - The response from the API
   * @example
   * const { login } = useAuth()
   * const data = {
   * email: "john@example.com",
   * password: "123456789"
   * }
   * const response = await login(data)
   */
  const login = async (data: TAuth) => {
    try {
      const res = await $fetch<User | undefined>("/api/auth/login", {
        method: "POST",
        body: data,
      });
      user.value = res;
      return res;
    } catch (error: any) {
      throw error.data;
    }
  };

  /**
   * Method to logout a user
   * @returns {Promise<boolean>} - The response from the API
   * @example
   * const { logoutUser } = useAuth()
   * const response = await logoutUser()
   * console.log(response)
   */
  const logoutUser = async () => {
    try {
      await $fetch("/api/auth/logout");
      user.value = undefined;
      return true;
    } catch (error: any) {
      throw error.data;
    }
  };

  /**
   * Method to get the current user
   * @returns {Promise<User | undefined>} - The response from the API
   * @example
   * const { getMe } = useAuth()
   * const response = await getMe()
   * console.log(response)
   */
  const getMe = async () => {
    try {
      const res = await $fetch<User | undefined>("/api/auth/me", {
        headers: useRequestHeaders(),
        credentials: "include",
      });
      if (res?.id) user.value = res;
      return res?.id ? res : undefined;
    } catch (error: any) {
      throw error.data;
    }
  };

  return { register, login, getMe, logoutUser };
};
