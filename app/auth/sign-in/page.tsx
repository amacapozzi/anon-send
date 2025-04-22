"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Eye, LoaderIcon, LogIn } from "lucide-react";
import Link from "next/link";
import { loginAccount } from "@/actions/auth";
import { Toaster, toast } from "sonner";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthSlider } from "@/components/auth-slider";
import { SignInFormValues } from "@/types/auth";
import { signInSchema } from "@/schemas/auth";
import { AuthInput } from "@/components/auth-input";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { routes } from "@/consts/routes";

export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      alias: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    const { success, error } = await loginAccount(data);

    if (success) {
      toast.success("Welcome back!", {
        description: "Redirecting to your dashboard...",
        style: {
          background: "#141416",
          borderColor: "#3a3a48",
        },
      });

      setTimeout(() => {
        router.push(routes.mail.inbox);
      }, 1000);
    } else {
      const key = Object.keys(error ?? {})[0];
      const description = (error as any)?.[key]?.message ?? "Unexpected error.";

      toast.error("Login failed", {
        description,
        style: {
          background: "#141416",
          borderColor: "#3a3a48",
        },
      });
    }
  };

  useEffect(() => {
    const firstError = errors.alias?.message || errors.password?.message;

    if (firstError) {
      toast.error("Login failed", {
        description: firstError,
        style: {
          background: "#141416",
          borderColor: "#3a3a48",
        },
      });
    }
  }, [errors]);

  return (
    <div className="flex h-screen font-[family-name:var(--font-geist-sans)]">
      <Toaster theme="dark" position="top-right" />
      <div className="blur-[120px] bg-violet-300 w-full h-10 absolute z-[-1] top-0 right-1 opacity-55" />

      <AuthSlider sliderInterval={5000} />

      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-white mb-2">
            Login to your account
          </h1>
          <p className="text-gray-400 mb-8">
            Don’t have an account?{" "}
            <Link href="/auth/sign-up" className="text-white hover:underline">
              Sign up
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AuthInput
              type="text"
              control={control}
              name="alias"
              placeholder="Alias"
              className="w-full py-6 rounded bg-[#2a2a38] text-white border border-[#3a3a48] focus:outline-none focus:ring-2 focus:ring-[#5d4ea9]"
            />

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
                onClick={() => setShowPassword((prev) => !prev)}
                className={clsx(
                  "absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2",
                  showPassword ? "text-[#5d4ea9]" : "text-gray-400"
                )}
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>

            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-full cursor-pointer hover:bg-[#5150c8]/80 text-[15px] inline-flex items-center justify-center my-4 bg-[#5150c8] py-6 rounded text-white transition-colors"
            >
              {isSubmitting ? (
                <LoaderIcon className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Sign in
                  <LogIn className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
