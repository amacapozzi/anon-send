"use client";
import { Message } from "@/types/message";
import { useState } from "react";

interface Props {
  initialMessages: Message[];
}

export const ChatExampleUI = ({ initialMessages }: Props) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  return (
    <div>
       
    </div>
  );
};
