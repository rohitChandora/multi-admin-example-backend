import { User } from "./users";

export type Event = {
  "user::created": { user: User; verificationToken: string };
};
