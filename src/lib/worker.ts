import { Job, Worker } from "bullmq";
import { connection } from "./redis";

async function sendVerificationEmail() {
  console.log("Verifying email...");
  // Simulate some work
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("Email verified");
}

async function sendChangePasswordEmail() {
  console.log("Changing password...");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("Email verified");
}

async function sendFriendRequestEmail() {
  console.log("Sending friend request email...");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("Friend request email sent");
}

const jobsProcessors: any = {
  "verify-email": sendVerificationEmail,
  "password-change": sendChangePasswordEmail,
  "friend-request": sendFriendRequestEmail,
};

async function processJob(job: Job) {
  jobsProcessors[job.name](job);
}
const worker = new Worker(
  "email-queue",
  async (job) => {
    // Process the job

    await processJob(job);

    return { result: "Job completed" };
  },
  {
    connection,
  }
);

console.log("Worker is listening for jobs...");

worker.on("active", (job) => {
  console.log(`Processing job: ${job.name}`);
});

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});
