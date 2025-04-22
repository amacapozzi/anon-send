"use client";

import { useState } from "react";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { sendMail } from "@/actions/mail";
import { MailData } from "@/types/mail";

export default function ReplyForm({ replyTo }: { replyTo: MailData }) {
  const [replyContent, setReplyContent] = useState("");

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;

    await sendMail({
      recipients: [replyTo.sender?.alias ?? ""],
      subject: `Re: ${replyTo.subject}`,
      body: replyContent,
    });

    setReplyContent("");
  };

  return (
    <div className="mt-6">
      <Separator className="mb-6" />
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <img src="/placeholder.svg?height=40&width=40" alt="Mi avatar" />
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Escribe tu respuesta aquí..."
            className="min-h-[120px] resize-none"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <div className="mt-3 flex justify-between items-center">
            <Button variant="outline" size="sm">
              <Paperclip className="h-4 w-4 mr-2" />
              Adjuntar archivo
            </Button>
            <Button onClick={handleSendReply}>Enviar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
