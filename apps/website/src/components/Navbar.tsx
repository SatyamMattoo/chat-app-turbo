"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@repo/ui/components/ui/navigation-menu";
import { toast } from "@repo/ui/hooks/use-toast";
import { Button } from "@repo/ui/components/ui/button";

import logo from "../assets/logo.png";
import ThemeToggle from "./buttons/ThemeToggle";

export function Navbar() {
  const { status } = useSession();

  const logoutHandler = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been logged out",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
      console.log(err);
    }
  };

  return (
    <div className="w-full mx-auto flex justify-between items-center p-4 border-b-2 h-[10vh]">
      <Link href="/" legacyBehavior passHref>
        <span className="font-bold flex items-center justify-center gap-2">
          <Image src={logo} alt="logo" height={50} width={50} />
          <p className="text-2xl">
            Whats<span className="text-primary">Up</span>
          </p>
        </span>
      </Link>

      <NavigationMenu className="w-full">
        <NavigationMenuList>
          <div className="flex items-center space-x-4">
            {status === "authenticated" ? (
              <>
                <NavigationMenuItem>
                  <Link href="/dashboard" legacyBehavior passHref>
                    <Button>Dashboard</Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="outline" onClick={logoutHandler}>
                    Log Out
                  </Button>
                </NavigationMenuItem>
              </>
            ) : (
              <>
                <NavigationMenuItem>
                  <Link href="/auth/login" legacyBehavior passHref>
                    <Button variant="outline">Log In</Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/auth/signup" legacyBehavior passHref>
                    <Button>Register</Button>
                  </Link>
                </NavigationMenuItem>
              </>
            )}
            {/* <NavigationMenuItem>
              <ThemeToggle />
            </NavigationMenuItem> */}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
