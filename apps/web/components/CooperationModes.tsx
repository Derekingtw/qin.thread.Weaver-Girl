"use client";

import Link from "next/link";
import { ChartNoAxesColumnIncreasing, CircleDot, Shirt } from "lucide-react";
import { pickLocalizedText, useLanguage } from "../lib/i18n";

type Localized = { zhHant?: string | null; zhHans?: string | null };
const icons = [ChartNoAxesColumnIncreasing, CircleDot, Shirt];

export function CooperationModes({ modes }: { modes: Array<{ title: Localized; body: Localized }> }) {
  const { locale, t } = useLanguage();
  return (
    <section className="container section">
      <div className="section-head"><h2>{t("cooperationModes")}</h2></div>
      <div className="grid-3">
        {modes.map((mode, index) => {
          const Icon = icons[index] || CircleDot;
          return (
            <article className="card mode-card" key={pickLocalizedText(mode.title, locale)}>
              <div className="mode-illustration"><Icon size={38} /></div>
              <div>
                <h3 className="card-title">{pickLocalizedText(mode.title, locale)}</h3>
                <p className="card-desc">{pickLocalizedText(mode.body, locale)}</p>
                <Link className="section-link" href="/about">了解更多</Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
