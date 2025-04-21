"use server";
import bcryptjs from "bcryptjs";
import prisma from "@/lib/prisma";
import { signInSchema, signUpSchema } from "@/schemas/auth";
import { SignInFormValues, SignUpFormValues } from "@/types/auth";
import { saltRounds, maxPasswordUsedCount } from "@/consts/auth";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export const registerAccount = async (data: SignUpFormValues) => {
  try {
    const { password, alias } = data;

    const { success, error } = signUpSchema.safeParse(data);

    if (!success) {
      return { success: false, error: error.format() };
    }

    const passwordUsedCount = await prisma.user.count({
      where: {
        password: password,
      },
    });

    console.log("Password used count:", passwordUsedCount);

    if (passwordUsedCount >= maxPasswordUsedCount) {
      return {
        success: false,
        error: {
          password: {
            message:
              "This password has been used too many times. Please choose a different one.",
          },
        },
      };
    }

    const alreadyExistsAlias = await prisma.user.findFirst({
      where: {
        alias: alias,
      },
    });

    if (alreadyExistsAlias) {
      return {
        success: false,
        error: {
          alias: {
            message: "Alias already exists",
          },
        },
      };
    }

    const hashedPassword = await bcryptjs.hash(password, saltRounds);
    await prisma.user.create({
      data: {
        alias,
        password: hashedPassword,
      },
    });

    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.error("Error in signUp function:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
};

export const loginAccount = async (data: SignInFormValues) => {
  try {
    console.log("Login data:", data);

    const { password, alias } = data;

    const { success, error } = signInSchema.safeParse(data);

    if (!success) {
      console.error("Validation error:", error.format());
      return { success: false, error: error.format() };
    }

    const user = await prisma.user.findUnique({
      where: {
        alias,
      },
    });

    if (!user) {
      return { success: false, error: "Invalid alias or password" };
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: "Invalid alias or password" };
    }

    const payload = {
      id: user.id,
      alias: user.alias,
    };

    const token = signToken(payload, "24h");

    await setCookie(token);
    console.log("Cookie set successfully");

    return { success: true, message: "Login successful" };
  } catch (error) {
    console.error("Error in login function:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
};

const setCookie = async (token: string) => {
  try {
    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
  } catch (error) {
    console.error("Error setting cookie:", error);
  }
};
