import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * This function hashes a string
 * @param val {string} string to be hashed
 * @returns {string} hashed string
 *
 * @example
 * const hashedString = await hashString("password")
 */
export const hashString = (val: string) => {
  return bcrypt.hash(val, 12);
};

/**
 * This function compares a string with a hash
 * @param val {string} string to be compared
 * @param hash {string} hash to be compared with
 * @returns {boolean} true if string matches hash
 *
 * @example
 * const isMatch = await compareString("password", hashedString)
 * console.log(isMatch) // true
 */
export const compareString = (val: string, hash: string) => {
  return bcrypt.compare(val, hash);
};

/**
 * This function creates a jwt token
 * @param user {Partial<User>} user object
 * @returns {Promise<string>} jwt token
 *
 * @example
 * const token = await createToken({ ...user })
 */
export const createToken = (user: Partial<User>): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXP_DYS, audience: user.id?.toString() },
      (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      }
    );
  });
};

/**
 * This function verifies a jwt token
 * @param token {string} jwt token
 * @returns {Promise<Partial<User> | undefined>} user object
 *
 * @example
 * const user = await verifyToken(token)
 */
export const verifyToken = (token: string): Promise<Partial<User> | undefined> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded as Partial<User>);
    });
  });
};
