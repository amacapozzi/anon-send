"use server";
import { getCurrentUserServer } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const getPublicUsers = async () => {
  const currentUser = await getCurrentUserServer();

  const publicUsers = await prisma.user.findMany({
    where: { publicProfile: true },
  });

  return publicUsers.filter((users) => users.id !== currentUser?.id);
};
