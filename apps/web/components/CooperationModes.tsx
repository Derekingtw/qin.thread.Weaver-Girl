"use client";

import Link from "next/link";
import { ChartNoAxesColumnIncreasing, CircleDot, Shirt } from "lucide-react";
import { useLanguage } from "../lib/i18n";
import { cooperationDescription, cooperationLabel } from "../lib/cooperationDisplay";

const icons = [ChartNoAxesColumnIncreasing, CircleDot, Shirt];
const defaultModes = ["COMMISSION_5", "PLATFORM_BUYOUT_SERVICE", "READY_MADE_TO_PLATFORM"];

export function CooperationModes({ modes }: { modes: Array<{ mode?: string }> }) {
  const { locale, t } = useLanguage();
  const visibleModes = modes.length ? modes.map((item) => item.mode || "COMMISSION_5") : defaultModes;
  return (
    <section className="container section" id="cooperation">
      <div className="section-head">
        <h2>{t("cooperationModes")}</h2>
        <Link className="section-link" href="/about#cooperation">{t("learnFlow")}</Link>
      </div>
      <div className="grid-3">
        {visibleModes.map((mode, index) => {
          const Icon = icons[index] || CircleDot;
          return (
            <article className="card mode-card" key={mode}>
              <div className="mode-illustration"><Icon size={38} /></div>
              <div>
                <h3 className="card-title">{cooperationLabel(mode, locale)}</h3>
                <p className="card-desc">{cooperationDescription(mode, locale)}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
