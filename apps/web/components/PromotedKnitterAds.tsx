"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pickLocalizedText, useLanguage } from "../lib/i18n";
import { ImageWithFallback } from "./ImageWithFallback";

type Localized = { zhHant?: string | null; zhHans?: string | null; en?: string | null };
type Ad = { id: string; title: Localized; subtitle: Localized; listingTitle: Localized; price: string; deposit: string; deliveryDays: number; imageUrl: string; href: string };

export function PromotedKnitterAds({ ads }: { ads: Ad[] }) {
  const { locale, t } = useLanguage();
  return (
    <section className="container section">
      <div className="section-head">
        <div>
          <h2>{t("promotedAdsTitle")}</h2>
          <p className="section-subtitle">{t("promotedAdsSubtitle")}</p>
        </div>
        <Link className="section-link" href="/knitter/ads">{t("applyPromotion")}</Link>
      </div>
      <div className="grid-3 snap-row">
        {[0, 1, 2].map((slot) => {
          const ad = ads[slot];
          if (!ad) {
            return (
              <div className="card ad-empty" key={slot}>
                <div>
                  <span className="tag">{t("paidPromotion")}</span>
                  <h3>{t("emptyAdTitle")}</h3>
                  <p className="card-desc">{t("emptyAdBody")}</p>
                  <Link className="btn primary" href="/knitter/ads/new">{t("applyPromotion")}</Link>
                </div>
              </div>
            );
          }
          return (
            <article className="card listing-card ad-card" key={ad.id}>
              <span className="ad-label">{t("paidPromotion")}</span>
              <div className="image-frame"><ImageWithFallback src={ad.imageUrl} alt={pickLocalizedText(ad.title, locale)} /></div>
              <div className="card-body">
                <h3 className="card-title">{pickLocalizedText(ad.title, locale)}</h3>
                <p className="card-desc">{pickLocalizedText(ad.subtitle, locale)}</p>
                <span className="tag">{pickLocalizedText(ad.listingTitle, locale)}</span>
                <div className="meta-line"><span>價格 {ad.price}</span><span>訂金 {ad.deposit}</span><span>{ad.deliveryDays} 天</span></div>
                <Link className="btn" href={ad.href}>{t("allWorks")} <ArrowRight size={16} /></Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
