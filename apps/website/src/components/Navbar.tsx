import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@repo/ui/components/ui/navigation-menu";
import { Button } from "@repo/ui/components/ui/button";

import ThemeToggle from "./buttons/ThemeToggle";
import logo from "./svg/logo.svg";
import Image from "next/image";

export function Navbar() {
  return (
    <div className="w-full mx-auto flex justify-between items-center p-4 border-b-2">
      <Link href="/" legacyBehavior passHref>
        <span className="font-bold">
          <Image src={logo} alt="logo" height={50} width={50} />
        </span>
      </Link>
      <NavigationMenu className="w-full">
        <NavigationMenuList>
          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <NavigationMenuItem>
              <Link href="/signin" legacyBehavior passHref>
                <Button variant="secondary">Log In</Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/signup" legacyBehavior passHref>
                <Button variant="outline">Register</Button>
              </Link>
            </NavigationMenuItem>
            {/* <NavigationMenuItem>
              <Link href="/dashboard" legacyBehavior passHref>
                <Button>Dashboard</Button>
              </Link>
            </NavigationMenuItem> */}
            <NavigationMenuItem>
              <ThemeToggle />
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
