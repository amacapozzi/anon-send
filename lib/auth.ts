"use server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "./prisma";
import { verifyToken } from "./jwt";
import type { SessionUser } from "@/types/session";

export const getCurrentUserServer = async (): Promise<SessionUser | null> => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;

  if (!token) return null;

  try {
    const decoded = verifyToken(token) as jwt.JwtPayload;
    if (!decoded?.id) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { messages: true },
    });

    if (!user) return null;

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword as SessionUser;
  } catch {
    return null;
  }
};

export async function logout() {
  const cookieStore = cookies();
  (await cookieStore).delete("session");
}
