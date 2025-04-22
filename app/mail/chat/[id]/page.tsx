import MailLayout from "@/layouts/mail-layout";
import { getMailById } from "@/actions/mail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mails = await getMailById(id);

  console.log(mails);

  return (
    <MailLayout>
      <div className="flex-1 overflow-y-auto p-6"></div>
    </MailLayout>
  );
}
