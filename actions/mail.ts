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

export async function getInboxMails() {
  const user = await getCurrentUserServer();
  if (!user) return [];

  const messages = await prisma.message.findMany({
    where: {
      recipients: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      sender: true,
      recipients: {
        where: {
          userId: user.id,
        },
        select: {
          read: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(messages);

  return messages.map((msg) => ({
    id: msg.id,
    subject: msg.subject,
    body: msg.body,
    sender: msg.sender,
    read: msg.recipients[0]?.read ?? false,
    createdAt: msg.createdAt,
  }));
}

export async function markMailAsRead(messageId: string) {
  const user = await getCurrentUserServer();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    await prisma.recipient.updateMany({
      where: {
        messageId,
        userId: user.id,
      },
      data: {
        read: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to mark as read", error);
    return { success: false, error: "Failed to mark as read" };
  }
}

export async function markMailAsUnread(messageId: string) {
  const user = await getCurrentUserServer();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    await prisma.recipient.updateMany({
      where: {
        messageId,
        userId: user.id,
      },
      data: {
        read: false,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to mark as unread", error);
    return { success: false, error: "Failed to mark as unread" };
  }
}

export async function getMailById(messageId: string) {
  const user = await getCurrentUserServer();
  if (!user) return null;

  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: {
      sender: true,
      recipients: {
        where: {
          userId: user.id,
        },
        select: {
          read: true,
        },
      },
      files: true,
    },
  });

  if (!message) return null;

  const isRecipient = message.recipients.length > 0;
  if (!isRecipient) return null;

  return {
    id: message.id,
    subject: message.subject,
    content: message.body,
    timestamp: message.createdAt.toISOString(),
    sender: {
      name: message.sender?.alias ?? "Anónimo",
      email: `${message.sender?.alias}@mail.local`,
      avatar: message.sender?.avatarUrl ?? null,
    },
    attachments: message.files.map((file) => ({
      id: file.id,
      name: file.filename,
      size: `${(file.size / 1024).toFixed(1)} KB`,
    })),
    read: message.recipients[0]?.read ?? false,
  };
}
