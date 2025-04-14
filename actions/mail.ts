"use server";
import prisma from "@/lib/prisma";
import { mailSchema } from "@/schemas/mail";
import { Mail } from "@/types/mail";

export const sendMail = async (data: Mail) => {
  try {
    const { success, error } = mailSchema.safeParse(data);

    if (!success) {
      console.error("Validation error:", error.format());
      return { success: false, error: error.format() };
    }

    const isValidRecipient = await prisma.user.findFirst({
      where: {
        alias: data.recipient,
      },
    });
    if (!isValidRecipient) {
      return {
        success: false,
        error: "Recipient not found",
      };
    }

    await prisma.message.create({
      data: {
        senderId: data.senderId,
        recipient: data.recipient,
        subject: data.subject,
        body: data.body,
        files: data.files,
      },
    });

    return { success: true, message: "Mail sent successfully" };
  } catch (error) {
    console.error("Error sending mail:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
};
