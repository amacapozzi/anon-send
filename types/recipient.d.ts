export interface Recipient {
  id: string;
  messageId: string;
  userId: string;
  read: boolean;
  createdAt: Date;
}
