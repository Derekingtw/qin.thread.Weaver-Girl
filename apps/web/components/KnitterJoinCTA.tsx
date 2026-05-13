"use client";

import Link from "next/link";
import { BadgeCheck, HandCoins, Megaphone, ShieldCheck } from "lucide-react";
import { useLanguage } from "../lib/i18n";

export function KnitterJoinCTA() {
  const { t, locale } = useLanguage();
  const features = locale === "zh-Hans"
    ? ["订单协调", "平台客服", "安全结算", "付费曝光"]
    : ["訂單協調", "平台客服", "安全結算", "付費曝光"];
  const icons = [BadgeCheck, HandCoins, ShieldCheck, Megaphone];
  return (
    <section className="container join-banner">
      <div className="join-image" />
      <div className="join-content">
        <h2>{t("joinTitle")}</h2>
        <p className="section-subtitle">{t("joinBody")}</p>
        <div className="actions" style={{ marginTop: 18 }}>
          <Link className="btn primary" href="/register/knitter">{t("joinNow")}</Link>
          <Link className="btn" href="/knitter/join">{t("learnFlow")}</Link>
        </div>
        <div className="feature-row">
          {features.map((feature, index) => {
            const Icon = icons[index];
            return <div className="feature" key={feature}><Icon size={18} /> <span>{feature}</span></div>;
          })}
        </div>
      </div>
    </section>
  );
}
