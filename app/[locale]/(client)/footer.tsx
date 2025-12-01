'use client'

import { Briefcase, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Image from "next/image";
import logo from '@/public/TajWorksLogo.jpg'
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-muted mt-24">
      <div className="container mx-auto px-12 sm:px-16 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image className="object-cover w-[150px] h-20 rounded-md" src={logo} alt={t("logoAlt") ?? "TajWorks Logo"} />
            </div>
            <p className="text-muted-foreground mb-6">
              {t("1")}
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center dark:bg-black dark:hover:bg-white dark:hover:text-black rounded-full bg-white hover:bg-primary hover:text-white transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="mb-4">{t("2")}</h4>
            <ul className="space-y-3">
              <li>{t("3")}</li>
              <li>{t("4")}</li>
              <li>{t("5")}</li>
              <li>{t("6")}</li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="mb-4">{t("7")}</h4>
            <ul className="space-y-3">
              <li>{t("8")}</li>
              <li>{t("9")}</li>
              <li>{t("10")}</li>
              <li>{t("11")}</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4">{t("12")}</h4>
            <ul className="space-y-3">
              <li>{t("13")}</li>
              <li>{t("14")}</li>
              <li>{t("15")}</li>
              <li>{t("16")}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
          <p>{t("17")}</p>
        </div>
      </div>
    </footer>
  );
}
