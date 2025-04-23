"use server";

import prisma from "@/lib/prisma";
import { mailSchema } from "@/schemas/mail";
import { Mail } from "@/types/mail";
import { validateRecipients } from "@/utils/mail";
import { getCurrentUserServer } from "@/lib/auth";
import { MailData } from "@/types/mail";
import { getCurrentPathFromCookie } from "@/lib/headers";
import { cookies } from "next/headers";

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

function getWhereFromCategory(category: string, userId: string) {
  switch (category) {
    case "sent":
      return { senderId: userId };

    case "inbox":
      return {
        recipients: {
          some: {
            userId,
          },
        },
      };

    case "trash":
      return {
        OR: [
          {
            senderId: userId,
            isDeleted: true,
          },
          {
            recipients: {
              some: {
                userId,
                message: {
                  isDeleted: true,
                },
              },
            },
          },
        ],
      };

    default:
      return {
        recipients: {
          some: {
            userId,
          },
        },
      };
  }
}

export async function getMailsByCategory(): Promise<MailData[]> {
  const user = await getCurrentUserServer();
  if (!user) return [];

  const cookieStore = await cookies();
  const currentPath = cookieStore.get("currentPath")?.value;

  const category = currentPath?.split("/").pop() ?? "";

  const messages = await prisma.message.findMany({
    where: getWhereFromCategory(category, user.id),
    include: {
      sender: true,
      recipients: {
        where: { userId: user.id },
        select: { read: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return messages.map((msg) => ({
    id: msg.id,
    subject: msg.subject,
    body: msg.body,
    sender: msg.sender,
    read: msg.recipients?.[0]?.read ?? false,
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
import { Message } from "@/types/message";

export async function getMailById(
  messageId: string
): Promise<Message[] | null> {
  const user = await getCurrentUserServer();
  if (!user) return null;

  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: {
      sender: true,
      recipients: {
        include: {
          user: true,
        },
      },
      files: true,
      views: true,
      conversation: {
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            include: {
              sender: true,
              recipients: {
                include: {
                  user: true,
                },
              },
              files: true,
              views: true,
            },
          },
        },
      },
    },
  });

  if (!message) return null;

  const isRecipient = message.recipients.some((r) => r.userId === user.id);
  if (!isRecipient) return null;

  const threadMessages = message.conversation
    ? message.conversation.messages
    : [message];

  const result: Message[] = threadMessages.map((msg) => ({
    id: msg.id,
    subject: msg.subject,
    body: msg.body,
    encrypted: msg.encrypted,
    senderId: msg.senderId,
    sender: msg.sender
      ? {
          id: msg.sender.id,
          alias: msg.sender.alias,
          avatarUrl: msg.sender.avatarUrl,
          publicProfile: msg.sender.publicProfile,
          createdAt: msg.sender.createdAt,
        }
      : null,
    conversationId: msg.conversationId,
    recipients: msg.recipients.map((r) => ({
      id: r.id,
      messageId: r.messageId,
      userId: r.userId,
      read: r.read,
      createdAt: r.createdAt,
      user: {
        id: r.user.id,
        alias: r.user.alias,
        avatarUrl: r.user.avatarUrl,
        publicProfile: r.user.publicProfile,
        createdAt: r.user.createdAt,
      },
    })),
    files: msg.files.map((file) => ({
      id: file.id,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      encrypted: file.encrypted,
      messageId: file.messageId,
      uploadedAt: file.uploadedAt,
    })),
    views: msg.views.map((view) => ({
      id: view.id,
      messageId: view.messageId,
      userId: view.userId,
      viewedAt: view.viewedAt,
      ipAddress: view.ipAddress,
      userAgent: view.userAgent,
    })),
    createdAt: msg.createdAt,
    expiresAt: msg.expiresAt,
    maxViews: msg.maxViews,
    isDeleted: msg.isDeleted,
  }));

  return result;
}
