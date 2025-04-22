import { Queue } from "bullmq";
import { connection } from "./redis";

const queue = new Queue("email-queue", {
  connection,
});

export { queue };
