import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST as string,
  port: Number(process.env.SMTP_PORT),
  secure: Boolean(process.env.SMTP_SECURE), // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_USER as string,
    pass: process.env.SMTP_PASS as string,
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
