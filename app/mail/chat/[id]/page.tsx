import MailLayout from "@/layouts/mail-layout";
import { getMailById } from "@/actions/mail";
import ChatUI from "@/components/chat";
import { getCurrentUserServer } from "@/lib/auth";
import Chat from "@/components/chat";
import { User } from "@prisma/client";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mails = await getMailById(id);
  const user = await getCurrentUserServer();

  console.log(mails);

  return (
    <MailLayout>
      <div className="flex-1 overflow-y-auto">
        <ChatUI user={user as User} initialMessages={mails ?? []} />
      </div>{" "}
    </MailLayout>
  );
}
