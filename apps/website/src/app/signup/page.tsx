import * as React from "react";

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
import { BsGithub, BsGoogle } from "react-icons/bs";

export default function SignUp() {
  return (
    <div className="w-full h-screen flex justify-center items-center p-4">
      <Card className="w-[370px]">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className=" mb-4">
            <div className="flex gap-2">
              <Button
                variant={"outline"}
                className="w-full flex items-center gap-2"
              >
                <BsGithub />
                GitHub
              </Button>
              <Button
                variant={"outline"}
                className="w-full flex items-center gap-2"
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
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Satyam Mattoo" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="satyam@example.com" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="Password" />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button>Sign Up</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
