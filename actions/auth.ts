"use server";
import bcryptjs from "bcryptjs";
import prisma from "@/lib/prisma";
import { signUpSchema } from "@/schemas/auth";
import { SignUpFormValues } from "@/types/auth";
import { saltRounds, maxPasswordUsedCount } from "@/consts/auth";

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
