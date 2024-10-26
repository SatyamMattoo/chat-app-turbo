"use client";
import React, { useState } from "react";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BsGithub, BsGoogle } from "react-icons/bs";

import { toast } from "@repo/ui/hooks/use-toast";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";

import { register } from "~/src/actions/auth";
import Link from "next/link";

// Zod schema for client-side validation
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export function Register() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const validation = registerSchema.safeParse({ name, email, password });

    if (!validation.success) {
      const errorMessage = validation.error.errors
        .map((err) => err.message)
        .join(", ");
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    let toastId;
    try {
      setLoading(true);
      toastId = toast({
        title: "Creating account...",
        description: "Please wait while we create your account.",
      });

      await register({ name, email, password });

      toastId.dismiss();
      toast({
        title: "Account created",
        description: "You can now log in with your credentials.",
      });
      router.push("/auth/login");
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="w-[370px] mx-auto">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex gap-2">
            <Button
              variant={"outline"}
              className="w-full flex items-center gap-2"
              onClick={() => {
                signIn("github");
              }}
            >
              <BsGithub />
              GitHub
            </Button>
            <Button
              variant={"outline"}
              className="w-full flex items-center gap-2"
              onClick={() => {
                signIn("google");
              }}
            >
              <BsGoogle />
              Google
            </Button>
          </div>
          <div className="text-center my-2 flex space-x-2 mx-auto justify-center items-center">
            <div className="w-full h-[1px] bg-gray-600" />
            <span className="text-gray-500">or</span>
            <div className="w-full h-[1px] bg-gray-600" />
          </div>
        </div>
        <form
          className="grid w-full items-center gap-4"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Satyam Mattoo" required />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="satyam@example.com"
              required
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <div className="flex w-full justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </div>
          <div className="flex w-full justify-end">
            <Link
              href="/auth/login"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Already have a account? Login here.
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
