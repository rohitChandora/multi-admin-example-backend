import { Event } from "../../types/common";
import { EVENTS } from "../constants";
import { eventBus } from "../eventBus";

eventBus.on(
  EVENTS["user::created"],
  async ({ user, verificationToken }: Event["user::created"]) => {
    //
  }
);
console.log("event listener registered for user::created");
