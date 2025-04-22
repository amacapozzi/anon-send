export interface Message {
  id: string;
  subject: string;
  body: string;
  encrypted: boolean;
  senderId: string | null;
  sender: User | null;
  conversationId?: string | null;
  recipients: Recipient[];
  files: FileAttachment[];
  views: MessageView[];
  createdAt: Date;
  expiresAt?: Date | null;
  maxViews?: number | null;
  isDeleted: boolean;
}
