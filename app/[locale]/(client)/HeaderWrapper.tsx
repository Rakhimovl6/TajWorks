"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Header } from "./Header";
import { GetToken } from "@/utils/token";
import { logOut } from "../(auth)/api/logOut/logOutApi";
import { jwtDecode } from "jwt-decode";

export default function HeaderWrapper() {
  const router = useRouter();
  const pathname = usePathname();

  const [darkMode, setDarkMode] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [mounted, setMounted] = useState(false);

  // --------------------------
  //  Плавный fade-переключатель темы
  // --------------------------
  const smoothToggleTheme = (enableDark: boolean) => {
    const overlay = document.createElement("div");
    overlay.className = "theme-fade-overlay";
    document.body.appendChild(overlay);

    if (enableDark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }

    requestAnimationFrame(() => overlay.classList.add("hide"));

    setTimeout(() => overlay.remove(), 300);
  };
  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh");
    if (refresh) {
      await logOut(refresh);
    }

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setIsLogged(false);
  };


  // --------------------------
  //  Инициализация темы и авторизации
  // --------------------------
  useEffect(() => {
    // Тема
    const savedTheme = localStorage.theme;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");



    // предотвращаем мигалки
    const t = setTimeout(() => document.documentElement.classList.remove("no-transitions"), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const user = GetToken()?.user_id;
    setIsLogged(!!user);
    setMounted(true);
  }, []);

  // --------------------------
  //  Тогглер темы
  // --------------------------
  const onToggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    smoothToggleTheme(newMode);
  };

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const access = localStorage.getItem("access");

    if (access) {
      try {
        const decoded: any = jwtDecode(access);
        setRole(decoded.role || null);
      } catch (err) {
        console.error("Token decode error:", err);
        setRole(null);
      }
    } else {
      setRole(null);
    }
  }, []);

  return (
    <Header
      currentPage={pathname}
      onNavigate={(path) => router.push(path)}
      darkMode={darkMode}
      onToggleDarkMode={onToggleDarkMode}
      isLogged={isLogged}
      onLogout={handleLogout}
      role={role}
    />
  );
}
