import { z } from "zod";
import { mailSchema } from "@/schemas/mail";

export type Mail = z.infer<typeof mailSchema>;

export interface SendMessageData {
  recipients: string[];
  subject: string;
  body: string;
  file: File | null;
}

export type MailData = {
  id: string;
  subject: string;
  body: string;
  sender: {
    id: string;
    password: string;
    alias: string;
    publicProfile: boolean;
    createdAt: Date;
    avatarUrl: string | null;
  } | null;
  read: boolean;
  createdAt: Date;
};

export type Attachment = {
  id: string;
  name: string;
  size: string;
};

export type EmailMessage = {
  id: string;
  subject: string;
  content: string;
  timestamp: string;
  sender: {
    name: string;
    email: string;
    avatar: string | null;
  };
  attachments: Attachment[];
};
