"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { Eye, LoaderIcon, LogIn, Shuffle } from "lucide-react";
import Link from "next/link";
import { registerAccount } from "@/actions/auth";
import { Toaster, toast } from "sonner";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { useState } from "react";
import { generateRandomAlias } from "@/lib/utils";
import { AuthSlider } from "@/components/auth-slider";
import { SignUpFormValues } from "@/types/auth";
import { signUpSchema } from "@/schemas/auth";
import { AuthInput } from "@/components/auth-input";

export default function SignUp() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isLoading },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      alias: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    if (!agreed) {
      toast.error("Could not be registered", {
        style: {
          background: "#141416",
          borderColor: "#3a3a48",
        },
        description: "You must agree to the terms and conditions",
      });
      return;
    }

    const { success, error } = await registerAccount(data);

    if (success) {
      toast.success("User created successfully", {
        style: {
          background: "#141416",
          borderColor: "#3a3a48",
        },
      });
    } else {
      toast.error("Could not be registered", {
        style: {
          background: "#141416",
          borderColor: "#3a3a48",
        },
        description: error?.toString() || "An unexpected error occurred.",
      });
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [alias, setAlias] = useState("");

  const handleRandomAlias = (e: any) => {
    e.preventDefault();
    const randomAlias = generateRandomAlias();
    setAlias(randomAlias);
  };

  useEffect(() => {
    setValue("alias", alias);
  }, [alias, setValue]);

  useEffect(() => {
    if (errors.alias) {
      toast.error("Could not be registered", {
        style: {
          background: "#141416",
          borderColor: "#3a3a48",
        },
        description: errors.alias.message,
      });
      return;
    }

    if (errors.password) {
      toast.error("Could not be registered", {
        style: {
          background: "#141416",
          borderColor: "#3a3a48",
        },
        description: errors.password.message,
      });
      return;
    }

    if (errors.confirmPassword) {
      toast.error("Could not be registered", {
        style: {
          background: "#141416",
          borderColor: "#3a3a48",
        },
        description: errors.confirmPassword.message,
      });
      return;
    }
  }, [errors]);

  return (
    <div className="flex h-screen">
      <Toaster theme="dark" position="top-right" />

      <div className="blur-[120px] bg-violet-300 w-full h-10 absolute z-[-1] top-0 right-1 opacity-55"></div>

      <AuthSlider sliderInterval={5000} />

      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-white mb-2">
            Create an account
          </h1>
          <p className="text-gray-400 mb-8  font-[family-name:var(--font-geist-sans)]">
            Already have an account?{" "}
            <Link href="#" className="text-white hover:underline">
              Log in
            </Link>
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4  font-[family-name:var(--font-geist-sans)]"
          >
            <div className="grid grid-cols-1 md:grid-cols:1 ap-4">
              <div className="relative">
                <AuthInput
                  type="text"
                  control={control}
                  name="alias"
                  placeholder="Alias"
                  className="w-full py-6 rounded bg-[#2a2a38] text-white border border-[#3a3a48] focus:outline-none focus:ring-2 focus:ring-[#5d4ea9]"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      type="button"
                      onClick={handleRandomAlias}
                      className="absolute hover:text-[#5d4ea9] cursor-pointer right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <Shuffle className={`h-5 w-5`} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Geneate random Alias</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="relative">
              <AuthInput
                type={showPassword ? "text" : "password"}
                control={control}
                name="password"
                placeholder="Enter your password"
                className="w-full py-6 rounded bg-[#2a2a38] text-white border border-[#3a3a48] focus:outline-none focus:ring-2 focus:ring-[#5d4ea9]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 ${
                  showPassword ? "text-[#5d4ea9]" : "text-gray-400"
                }`}
              >
                <Eye className={`h-5 w-5`} />
              </button>
            </div>
            <div>
              <AuthInput
                control={control}
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                className="w-full py-6 rounded bg-[#2a2a38] text-white border border-[#3a3a48] focus:outline-none focus:ring-2 focus:ring-[#5d4ea9]"
              />
            </div>

            <div className="flex items-center  font-[family-name:var(--font-geist-sans)]">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                className="h-4 w-4 rounded border-gray-600 text-[#5d4ea9] focus:ring-[#5d4ea9]"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-400 ">
                I agree to the{" "}
                <Link href="#" className="text-white hover:underline">
                  Terms & Conditions
                </Link>
              </label>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full cursor-pointer inline-flex flex-row items-center justify-center my-4 font-[family-name:var(--font-geist-sans)] bg-[#5150c8] p-3 rounded text-white font-medium transition-colors"
            >
              Create account
              <LogIn className="ml-2 h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
