import { webName } from "@/lib/utils";
import nodemailer from "nodemailer";
import { extractTextFromHTML } from "./extract-text-from-html";

//  SMTP configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendMail = async (
  to: string | string[],
  options: {
    subject: string;
    html: string;
    text?: string;
    replyTo?: string;
    displayName?: string;
    organization?: string;
  },
) => {
  const mailOptions = {
    from: `"${options.displayName || `${webName} Team`}" <${
      process.env.EMAIL_USER
    }>`,
    to: Array.isArray(to) ? to.join(", ") : to,
    subject: options.subject,
    html: options.html,
    text: options.text || extractTextFromHTML(options.html),
    replyTo: options.replyTo || process.env.EMAIL_USER,
    headers: {
      "X-Organization": options.organization || webName,
    },
    attachments: [
      {
        filename: "logo.png",
        path: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
        cid: "logo", // same as in img src
      },
    ],
  };
  try {
    const data = await transporter.sendMail(mailOptions);
    console.log(" email sent: ", data);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Failed to send email. ");
  }
};
