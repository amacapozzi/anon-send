"use server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "./prisma";
import { verifyToken } from "./jwt";

export const getCurrentUserServer = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;
  if (!token) return null;

  try {
    const decoded = verifyToken(token) as jwt.JwtPayload;

    if (!decoded) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { messages: true },
    });

    const { password, ...userWithoutPassword } = user || {};

    return userWithoutPassword;
  } catch {
    return null;
  }
};
