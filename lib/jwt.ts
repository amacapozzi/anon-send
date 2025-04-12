import { cookies } from "next/headers";
import { JWT_SECRET } from "@/consts/auth";
import jwt, { JwtPayload } from "jsonwebtoken";

export const signToken = (payload: JwtPayload, expiresIn: string) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

export const getCookie = async () => {
  const cookie = (await cookies()).get("session");

  if (!cookie) {
    return null;
  }

  return cookie.value;
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token: string) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};
