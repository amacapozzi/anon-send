import MailLayout from "@/layouts/mail-layout";

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  return (
    <MailLayout>
      <div></div>
    </MailLayout>
  );
}
