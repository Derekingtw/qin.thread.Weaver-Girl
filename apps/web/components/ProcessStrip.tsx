"use client";

import { CreditCard, MessageCircle, PackageCheck, SearchCheck, Truck } from "lucide-react";
import { pickLocalizedText, useLanguage } from "../lib/i18n";

type Localized = { zhHant?: string | null; zhHans?: string | null };
const icons = [CreditCard, MessageCircle, SearchCheck, CreditCard, Truck];

export function ProcessStrip({ steps }: { steps: Array<{ title: Localized; description: Localized }> }) {
  const { locale } = useLanguage();
  return (
    <section className="container process-card" id="protection">
      {steps.map((step, index) => {
        const Icon = icons[index] || PackageCheck;
        return (
          <div className="process-step" key={pickLocalizedText(step.title, locale)}>
            <div className="process-icon"><Icon size={21} /></div>
            <div>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <b>{pickLocalizedText(step.title, locale)}</b>
              <p>{pickLocalizedText(step.description, locale)}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
