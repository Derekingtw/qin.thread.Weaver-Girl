"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { pickLocalizedText, useLanguage, useStyleTheme, type StyleTheme } from "../lib/i18n";

type Localized = { zhHant?: string | null; zhHans?: string | null; en?: string | null };
type HomeHeroProps = {
  settings: {
    heroBadge: Localized;
    heroSlogan: Localized;
    heroSubtitle: Localized;
    primaryCtaText: Localized;
    primaryCtaUrl: string;
    secondaryCtaText: Localized;
    secondaryCtaUrl: string;
    heroImageUrl?: string | null;
    heroImageAlt: Localized;
    showHeroStatCard: boolean;
    heroStatLabel: Localized;
    heroStatValue?: string | null;
    heroStatExtra: Localized;
    trustPoints: Localized[];
  };
};

const themeHeroImages: Record<StyleTheme, string> = {
  fashion: "/brand/hero-qinshixian-fashion.png",
  cozy: "/brand/hero-qinshixian-cozy.png",
  chinese: "/brand/hero-qinshixian-chinese.png"
};

const themeHeroAlt: Record<StyleTheme, Localized> = {
  fashion: {
    zhHant: "秦時線時尚風精品毛線禮盒形象圖",
    zhHans: "秦时线时尚风精品毛线礼盒形象图",
    en: "Qin Thread fashion theme premium yarn gift box hero image"
  },
  cozy: {
    zhHant: "秦時線溫馨風毛線、乾燥花與手作時光形象圖",
    zhHans: "秦时线温馨风毛线、干燥花与手作时光形象图",
    en: "Qin Thread cozy theme yarn, dried flowers, and handmade moment hero image"
  },
  chinese: {
    zhHant: "秦時線中國風毛線、竹影與書卷感形象圖",
    zhHans: "秦时线中国风毛线、竹影与书卷感形象图",
    en: "Qin Thread Chinese theme yarn, bamboo, and refined paper-scroll hero image"
  }
};

export function HomeHero({ settings }: HomeHeroProps) {
  const { locale } = useLanguage();
  const { theme } = useStyleTheme();
  const heroImage = themeHeroImages[theme] || settings.heroImageUrl || "/brand/hero-qinshixian-yarn.png";
  const heroAlt = pickLocalizedText(themeHeroAlt[theme] || settings.heroImageAlt, locale);
  return (
    <section
      className="hero-wrap"
      style={{ "--hero-image": `url(${heroImage})` } as CSSProperties}
    >
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">{pickLocalizedText(settings.heroBadge, locale)}</span>
          <h1>{pickLocalizedText(settings.heroSlogan, locale)}</h1>
          <p>{pickLocalizedText(settings.heroSubtitle, locale)}</p>
          <div className="hero-actions">
            <Link className="btn primary" href={settings.primaryCtaUrl}>{pickLocalizedText(settings.primaryCtaText, locale)}</Link>
            <Link className="btn" href={settings.secondaryCtaUrl}>{pickLocalizedText(settings.secondaryCtaText, locale)}</Link>
          </div>
          <div className="trust-points">
            {settings.trustPoints.filter((point) => pickLocalizedText(point, locale)).map((point) => (
              <span key={pickLocalizedText(point, locale)}><i />{pickLocalizedText(point, locale)}</span>
            ))}
          </div>
        </div>
        <div className="hero-media" role="img" aria-label={heroAlt}>
          {settings.showHeroStatCard ? (
            <div className="stat-card">
              <small>{pickLocalizedText(settings.heroStatLabel, locale)}</small>
              <strong>{settings.heroStatValue}</strong>
              <small>{pickLocalizedText(settings.heroStatExtra, locale)}</small>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
