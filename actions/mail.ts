"use server";

import prisma from "@/lib/prisma";
import { mailSchema } from "@/schemas/mail";
import { Mail } from "@/types/mail";
import { validateRecipients } from "@/utils/mail";
import { getCurrentUserServer } from "@/lib/auth";

export const sendMail = async (data: Mail) => {
  try {
    const user = await getCurrentUserServer();

    const { success, error } = mailSchema.safeParse(data);

    if (!success) {
      console.error("Validation error:", error.format());

      const { errors } = error;

      console.log(errors);

      return { success: false, error: error.format() };
    }

    const { valid, invalid } = await validateRecipients(
      data.recipients as string[]
    );

    console.log(data.recipients);

    if (invalid.length > 0) {
      return {
        success: false,
        message: "The following recipients do not exist",
        invalid,
      };
    }

    const message = await prisma.message.create({
      data: {
        subject: data.subject,
        body: data.body,
        encrypted: false,
        senderId: user?.id,
        expiresAt: data.expiresAt ?? null,
        maxViews: data.maxViews ?? null,
        files: {
          create:
            data.files?.map((file) => ({
              filename: file.filename,
              mimetype: file.mimetype,
              size: file.size,
              encrypted: false,
            })) || [],
        },
        recipients: {
          create: valid.map((user) => ({
            userId: user.id,
          })),
        },
      },
    });

    console.log(message);

    return {
      success: true,
      message: "Mail sent successfully",
      messageId: message.id,
    };
  } catch (error) {
    console.error("Error sending mail:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
};
