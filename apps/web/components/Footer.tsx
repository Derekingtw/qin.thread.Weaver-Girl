"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../lib/i18n";
import { Logo } from "./Logo";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo footer />
          <p>{t("footerLine")}</p>
        </div>
        <div>
          <h3>{t("quickLinks")}</h3>
          <Link href="/works">{t("findWorks")}</Link>
          <Link href="/platform-products">{t("platformProducts")}</Link>
          <Link href="/announcements">{t("announcements")}</Link>
          <Link href="/guarantee">{t("protection")}</Link>
        </div>
        <div>
          <h3>{t("about")}</h3>
          <Link href="/about">{t("brandStory")}</Link>
          <Link href="/about#cooperation">{t("cooperationModes")}</Link>
          <Link href="/legal">{t("support")}</Link>
        </div>
        <div>
          <h3>{t("subscribe")}</h3>
          <p>留下信箱，接收秦時線活動、選品與服務更新。</p>
          <div className="email-row">
            <input placeholder={t("emailPlaceholder")} />
            <button type="button" aria-label={t("subscribe")}><ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
      <div className="container copyright">© 2026 秦時線 Qin Thread. All rights reserved.</div>
    </footer>
  );
}
