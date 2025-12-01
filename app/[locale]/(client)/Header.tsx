'use client'

import { Briefcase, Menu, X, User, SquareUser, LogOut, UserStar } from "lucide-react";
import { createIcons, icons } from 'lucide';

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import logo from '@/public/TajWorksLogo.jpg'
import Image from "next/image";
import { useTranslations } from "next-intl";
import { jwtDecode } from "jwt-decode";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import usaImg from '@/public/united-kingdom (1).png'
import rusImg from '@/public/russia (1).png'
import tjImg from '@/public/flag.png'
import { usePathname, useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { logOut } from "../(auth)/api/logOut/logOutApi";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isLogged: boolean,
  onLogout: () => void;
  role: string | null
}
interface TokenData {
  role: string;
}

export function Header({ currentPage, onNavigate, darkMode, onToggleDarkMode, isLogged, onLogout, role }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [desktopPopoverOpen, setDesktopPopoverOpen] = useState(false);
  const [mobilePopoverOpen, setMobilePopoverOpen] = useState(false);


  const t = useTranslations('Header');
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams();


  const changeLang = (locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    router.replace(segments.join('/'));
    setOpen(false);
  };



  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg dark:bg-background/80">
      <div className="container mx-auto px-12 sm:px-16 lg:px-20">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Image className="sm:w-[150px] w-[100px] object-cover h-15 rounded-md" src={logo} alt='not found' />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onNavigate("/")}
              className={`transition-colors ${currentPage === "landing"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {t("1")}
            </button>
            <button
              onClick={() => onNavigate("/vacancies")}
              className={`transition-colors ${currentPage === "vacancies"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {t("2")}
            </button>
            {role?.toLowerCase() === "employer" && (
              <button
                onClick={() => onNavigate("/postAJob")}
                className={`transition-colors ${currentPage === "post-vacancy"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {t("3")}
              </button>
            )}


          </nav>


          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Select */}
            <Select value={locale as string} onValueChange={changeLang}>
              <SelectTrigger className="w-20 border-none shadow-none">
                <SelectValue placeholder="Язык" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  <Image className="w-[30px]" src={usaImg} alt='EN' />
                  <p>EN</p>
                </SelectItem>
                <SelectItem value="ru">
                  <Image className="w-[30px]" src={rusImg} alt='RU' />
                  <p>RU</p>
                </SelectItem>
                <SelectItem value="tj">
                  <Image className="w-[30px]" src={tjImg} alt='TJ' />
                  <p>TJ</p>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* User Popover */}
            {isLogged && (
              <Popover open={desktopPopoverOpen} onOpenChange={setDesktopPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="rounded-full">
                    <User className="w-5 h-5" size={33} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-50">
                  <div className="grid gap-4">
                    <div>
                      <Button onClick={() => onNavigate('/myAccount')} variant="ghost" className="rounded-full gap-4">
                        <SquareUser className="w-5 h-5" size={18} />
                        <p>{t("6")}</p>
                      </Button>
                      <Button onClick={() => router.push("favorite")} variant="ghost" className="rounded-full gap-4">
                        <UserStar className="w-5 h-5" size={18} />
                        <p>{t("8")}</p>
                      </Button>
                      <Button onClick={() => { onLogout(); setDesktopPopoverOpen(false) }} variant="ghost" className="rounded-full gap-4 text-red-500">
                        <LogOut className="w-5 h-5" size={18} />
                        <p>{t("7")}</p>
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}



            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              className="rounded-full"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Log In / Sign Up */}
            {!isLogged && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onNavigate("logIn")}
                  className="rounded-full text-[16px]"
                >
                  {t("4")}
                </Button>

                <Button
                  onClick={() => onNavigate("signUp")}
                  className="rounded-full bg-primary hover:bg-primary/90"
                >
                  {t("5")}
                </Button>
              </>
            )}



          </div>


          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Select (Language) */}
            <Select value={locale as string} onValueChange={changeLang}>
              <SelectTrigger className="w-16 border-none shadow-none text-sm">
                <SelectValue placeholder="Lang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  <Image className="w-[30px]" src={usaImg} alt='EN' />
                  <p>EN</p>
                </SelectItem>
                <SelectItem value="ru">
                  <Image className="w-[30px]" src={rusImg} alt='RU' />
                  <p>RU</p>
                </SelectItem>
                <SelectItem value="tj">
                  <Image className="w-[30px]" src={tjImg} alt='TJ' />
                  <p>TJ</p>
                </SelectItem>
              </SelectContent>
            </Select>

            {isLogged && (
              <Popover open={mobilePopoverOpen} onOpenChange={setMobilePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="rounded-full">
                    <User className="w-5 h-5" size={33} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-50">
                  <div className="grid gap-4">
                    <div>
                      <Button onClick={() => onNavigate('/myAccount')} variant="ghost" className="rounded-full gap-4">
                        <SquareUser className="w-5 h-5" size={18} />
                        <p>{t("6")}</p>
                      </Button>
                      <Button onClick={() => router.push("favorite")} variant="ghost" className="rounded-full gap-4">
                        <UserStar className="w-5 h-5" size={18} />
                        <p>{t("8")}</p>
                      </Button>
                      <Button
                        onClick={() => { onLogout(); setMobileMenuOpen(false) }}
                        variant="ghost"
                        className="rounded-full gap-4 text-red-500"
                      >
                        <LogOut className="w-5 h-5" size={18} />
                        <p>{t("7")}</p>
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}


            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              className="rounded-full"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>


        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <button
              onClick={() => {
                onNavigate("/");
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 px-4 rounded-lg transition-colors ${currentPage === "landing"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
                }`}
            >
              {t("1")}
            </button>
            <button
              onClick={() => {
                onNavigate("vacancies");
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 px-4 rounded-lg transition-colors ${currentPage === "vacancies"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
                }`}
            >
              {t("2")}
            </button>
            {role?.toLowerCase() === "employer" && (
              <button
                onClick={() => onNavigate("/postAJob")}
                className={`transition-colors ${currentPage === "post-vacancy"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {t("3")}
              </button>
            )}

            {!isLogged && (

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    onNavigate("logIn");
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-full text-[16px]"
                >
                  {t("4")}
                </Button>

                <Button
                  onClick={() => {
                    onNavigate("signUp");
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-full bg-primary hover:bg-primary/90"
                >
                  {t("5")}
                </Button>
              </div>
            )}



          </div>
        )}
      </div>
    </header >
  );
}