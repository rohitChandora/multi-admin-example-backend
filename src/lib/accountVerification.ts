import { sendEmail } from "./email";

export function sendVerificationEmail(email: string, token: string) {
  const subject = "Email Verification";
  const body = `Please verify your email by clicking on the following link: http://localhost:3000/verify?token=${token}`;
  sendEmail(email, subject, body);
}
