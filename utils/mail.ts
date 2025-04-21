import prisma from "@/lib/prisma";

export async function validateRecipients(ids: string[]) {
  const uniqueIds = [...new Set(ids.map((id) => id.trim()))];

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: uniqueIds,
      },
    },
  });

  const foundIds = users.map((user) => user.id);

  const valid = users;
  const invalid = uniqueIds.filter((id) => !foundIds.includes(id));

  return { valid, invalid };
}
