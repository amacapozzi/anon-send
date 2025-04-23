import { headers } from "next/headers";
import { cookies } from "next/headers";

export const getHeaderByName = async (
  headerName: string
): Promise<string | null> => {
  const headersList = await headers();
  const headerValue = headersList.get(headerName);
  return headerValue?.toString() ?? null;
};

export const getCurrentPathFromCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("currentPath")?.value ?? "";
};
