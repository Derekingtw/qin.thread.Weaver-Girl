"use client";

import Link from "next/link";
import { useLanguage } from "../lib/i18n";

export function MobileStickyCTA() {
  const { t } = useLanguage();
  return (
    <div className="mobile-sticky-cta" aria-label="Mobile quick actions">
      <Link href="/works">{t("exploreWorks")}</Link>
      <Link href="/works" className="primary">{t("startCommission")}</Link>
    </div>
  );
}
