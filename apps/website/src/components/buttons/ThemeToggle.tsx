"use client";

import { Label } from "@repo/ui/components/ui/label";
import { Switch } from "@repo/ui/components/ui/switch";
import React, { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
    } else {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isDarkMode !== null) {
      const root = window.document.documentElement;
      if (isDarkMode) {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [isDarkMode]);

  if (!isMounted || isDarkMode === null) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="dark-mode-switch"
        checked={isDarkMode}
        onCheckedChange={() => setIsDarkMode(!isDarkMode)}
      />
      <Label htmlFor="dark-mode-switch">Dark Mode</Label>
    </div>
  );
};

export default ThemeToggle;
