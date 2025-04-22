export interface Conversation {
  id: string;
  subject: string;
  creatorId: string | null;
  createdAt: Date;
  updatedAt: Date;
  participants: ConversationParticipant[];
  messages: Message[];
}

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  joinedAt: Date;
}
