"use client";
import Link from "next/link";
import {
  MdDashboard,
  MdLogout,
  MdSettings,
  MdVerifiedUser,
} from "react-icons/md";
import Image from "next/image";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { signOut } from "next-auth/react";

import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@repo/ui/components/ui/sidebar";

import logo from "../assets/logo.png";

export function DashboardSidebar() {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <MdDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: (
        <MdVerifiedUser className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: (
        <MdSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div onClick={async () => await signOut()} className="cursor-pointer">
            <SidebarLink
              link={{
                label: "Logout",
                icon: <MdLogout />,
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image src={logo} alt="logo" height={40} width={40} />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        WhatsUp
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image src={logo} alt="logo" height={40} width={40} />
    </Link>
  );
};

