import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST as string,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_USERNAME as string,
    pass: process.env.SMTP_PASSWORD as string,
  },
});

export async function sendEmail(to: string, subject: string, body: string) {
  // Simulate sending an email
  try {
    await transporter.sendMail({
      from: '"MBA" <no-reply@mba.email>', // sender address
      to, // list of receivers
      subject,
      html: body, // html body
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}
