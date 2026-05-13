"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../lib/i18n";
import { LanguageToggle } from "./LanguageToggle";
import { Logo } from "./Logo";

export function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const links = [
    ["/works", t("findWorks")],
    ["/platform-products", t("platformProducts")],
    ["/announcements", t("announcements")],
    ["/knitter/join", t("knitterJoin")],
    ["#protection", t("protection")],
    ["/about", t("about")]
  ];
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav className="desktop-nav">
          {links.map(([href, label]) => (
            <Link href={href} key={href}>{label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <LanguageToggle />
          <Link className="login-pill ghost" href="/login">{t("login")}</Link>
          <Link className="login-pill" href="/register">{t("register")}</Link>
          <button className="mobile-menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-label="Menu">
            <Menu size={20} />
          </button>
        </div>
      </div>
      <nav className={`container mobile-nav ${open ? "open" : ""}`}>
        {links.map(([href, label]) => (
          <Link href={href} key={href}>{label}</Link>
        ))}
        <Link href="/login">{t("login")}</Link>
        <Link href="/register">{t("register")}</Link>
        <LanguageToggle />
      </nav>
    </header>
  );
}
