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
          <Link href="/knitter/join">{t("knitterJoin")}</Link>
        </div>
        <div>
          <h3>{t("about")}</h3>
          <Link href="/about">品牌故事</Link>
          <Link href="/about">合作模式</Link>
          <Link href="/legal">使用者協議</Link>
        </div>
        <div>
          <h3>{t("subscribe")}</h3>
          <p>接收平台公告、材料包上新與活動消息。</p>
          <div className="email-row">
            <input placeholder={t("emailPlaceholder")} />
            <button type="button" aria-label="訂閱"><ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
      <div className="container copyright">© 2026 秦時線 Qinshixian. All rights reserved.</div>
    </footer>
  );
}
