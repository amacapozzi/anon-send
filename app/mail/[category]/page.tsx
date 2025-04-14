import MailLayout from "@/layouts/mail-layout";
import { SearchUserCommandDialog } from "@/components/commands/search-user";

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  return (
    <MailLayout>
      <SearchUserCommandDialog />
    </MailLayout>
  );
}
