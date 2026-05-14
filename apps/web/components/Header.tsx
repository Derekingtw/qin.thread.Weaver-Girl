"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../lib/i18n";
import { LanguageToggle } from "./LanguageToggle";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const links = [
    ["/works", t("findWorks")],
    ["/platform-products", t("platformProducts")],
    ["/announcements", t("announcements")],
    ["/register/knitter", t("knitterJoin")],
    ["/guarantee", t("protection")],
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
          <div className="desktop-tools">
            <ThemeToggle />
            <LanguageToggle />
          </div>
          <Link className="login-pill ghost" href="/login">{t("login")}</Link>
          <Link className="login-pill desktop-register" href="/register">{t("register")}</Link>
          <button className="mobile-menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-label="Menu">
            {open ? <span aria-hidden="true">×</span> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <nav className={`container mobile-nav ${open ? "open" : ""}`}>
        <div className="mobile-nav-tools">
          <ThemeToggle />
          <LanguageToggle />
        </div>
        {links.map(([href, label]) => (
          <Link href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>
        ))}
        <Link href="/register" onClick={() => setOpen(false)}>{t("register")}</Link>
      </nav>
    </header>
  );
}
