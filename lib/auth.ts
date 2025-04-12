"use server";
import jwt from "jsonwebtoken";

import { cookies } from "next/headers";
import prisma from "./prisma";
import { JWT_SECRET } from "@/consts/auth";

export const getCurrentUserServer = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    return user;
  } catch {
    return null;
  }
};
