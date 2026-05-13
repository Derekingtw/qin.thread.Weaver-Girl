"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { pickLocalizedText, useLanguage } from "../lib/i18n";
import { ImageWithFallback } from "./ImageWithFallback";

type Localized = { zhHant?: string | null; zhHans?: string | null };
type Listing = { id: string; title: Localized; price: string; deposit: string; deliveryDays: number; mode: string; imageUrl: string };

export function CommissionListingSection({ listings }: { listings: Listing[] }) {
  const { locale, t } = useLanguage();
  return (
    <section className="container section">
      <div className="section-head">
        <div>
          <h2>{t("hotWorks")}</h2>
          <p className="section-subtitle">平台協調交易與驗收，讓委託更安心。</p>
        </div>
        <Link className="section-link" href="/works">{t("allWorks")}</Link>
      </div>
      <div className="grid-4">
        {listings.map((item) => (
          <article className="card listing-card" key={item.id}>
            <div className="image-frame">
              <ImageWithFallback src={item.imageUrl} alt={pickLocalizedText(item.title, locale)} />
              <span className="heart"><Heart size={17} /></span>
            </div>
            <div className="card-body">
              <h3 className="card-title">{pickLocalizedText(item.title, locale)}</h3>
              <div className="meta-line"><span>價格 {item.price}</span><span>訂金 {item.deposit}</span></div>
              <div className="price-row">
                <span className="tag">交付 {item.deliveryDays} 天</span>
                <span className="tag">{item.mode}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
