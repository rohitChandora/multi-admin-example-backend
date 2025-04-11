import { getID } from "../lib/helpers";
import { User } from "../types/users";

export const users: User[] = [];

export function getUsers() {
  return users;
}

export function createUser(
  user: Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt">
) {
  const newUser: User = {
    ...user,
    id: getID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };
  users.push(newUser);
}

export function userExistsWithEmail(email: string) {
  return users.some((user) => user.email === email);
}
