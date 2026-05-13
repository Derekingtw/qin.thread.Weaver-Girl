"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { pickLocalizedText, useLanguage } from "../lib/i18n";

type Localized = { zhHant?: string | null; zhHans?: string | null };
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

export function HomeHero({ settings }: HomeHeroProps) {
  const { locale } = useLanguage();
  const heroImage = settings.heroImageUrl || "/brand/hero-qinshixian-yarn.png";
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
        <div className="hero-media" role="img" aria-label={pickLocalizedText(settings.heroImageAlt, locale)}>
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
