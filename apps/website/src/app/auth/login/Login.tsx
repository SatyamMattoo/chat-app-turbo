"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { z } from "zod";

import { toast } from "@repo/ui/hooks/use-toast";

import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { login } from "~/src/actions/auth";

const loginSchema = z.object({
  email: z.string().min(2, "Email or username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSocialSignIn = async (provider: "github" | "google") => {
    const response = await signIn(provider, { redirect: false });
    if (response?.error) {
      toast({
        title: "Error",
        description: `Login with ${provider} failed: ${response.error}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Logged in with ${provider} successfully.`,
      });
      router.push("/dashboard"); // Redirect to dashboard or a different page upon success
    }
  };

  const handleCredentialSignIn = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const validation = loginSchema.safeParse({ email, password });
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

    try {
      setLoading(true);
      const response = await login({ email, password });
      if(response?.success === false) {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Success",
        description: "Logged in successfully.",
      });
      router.push("/dashboard"); // Redirect to dashboard or a different page upon success
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[370px] mx-auto">
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>
          Enter your credentials below to log in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => handleSocialSignIn("github")}
              type="button"
              disabled={loading}
            >
              <BsGithub />
              GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => handleSocialSignIn("google")}
              type="button"
              disabled={loading}
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
        <form onSubmit={handleCredentialSignIn}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email or Username</Label>
              <Input
                id="email"
                type="text"
                name="email"
                placeholder="Email or Username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex w-full justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </div>
            <div className="flex w-full justify-end">
              <Link
                href="/auth/signup"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Don't have an account? Sign up here.
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end"></CardFooter>
    </Card>
  );
}
