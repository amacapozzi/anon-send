import { getMailsByCategory } from "@/actions/mail";
import { AppSidebar } from "@/components/app-sidebar";
import { getCurrentUserServer } from "@/lib/auth";
import { getCurrentPathFromCookie, getHeaderByName } from "@/lib/headers";
import { SessionUser } from "@/types/session";

export default async function AppSidebarWrapper() {
  const mails = await getMailsByCategory();
  const user = await getCurrentUserServer();

  return <AppSidebar user={user as SessionUser} initialMails={mails} />;
}
