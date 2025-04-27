import Image from "next/image";

import { accounts, mails } from "@/consts/data";
import { cookies } from "next/headers";
import { getMailById } from "@/actions/mail";
import { Mail } from "@/components/mail";

export default async function MailPage({ params }: { params: { id: string } }) {
  const c = await cookies();

  const mailId = params.id;

  const mails = await getMailById(mailId);

  const layout = c.get("react-resizable-panels:layout:mail");
  const collapsed = c.get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/mail-dark.png"
          width={1280}
          height={727}
          alt="Mail"
          className="hidden dark:block"
        />
        <Image
          src="/examples/mail-light.png"
          width={1280}
          height={727}
          alt="Mail"
          className="block dark:hidden"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <Mail
          initialMails={mails}
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
        />
      </div>
    </>
  );
}
