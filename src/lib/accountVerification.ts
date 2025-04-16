import { sendEmail } from "./email";

export async function sendVerificationEmail(email: string, token: string) {
  const subject = "Email Verification";
  const body = `Please verify your email by clicking on the following link: <a href="http://localhost:3000/verify?token=${token}">Verify Your Email</a>`;
  await sendEmail(email, subject, body);
}
