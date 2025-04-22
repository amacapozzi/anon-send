export interface FileAttachment {
  id: string;
  filename: string;
  mimetype: string;
  size: number;
  encrypted: boolean;
  messageId: string;
  uploadedAt: Date;
}
