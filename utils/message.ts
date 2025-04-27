import { Message } from "@/types/message";

export const wasMessageRead = (message: Message): boolean => {
  return message.recipients.some((r) => r.read);
};
