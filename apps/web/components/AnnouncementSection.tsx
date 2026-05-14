"use client";

import Link from "next/link";
import { Megaphone } from "lucide-react";
import { pickLocalizedText, useLanguage } from "../lib/i18n";

type Localized = { zhHant?: string | null; zhHans?: string | null; en?: string | null };

export function AnnouncementSection({ announcements }: { announcements: Array<{ id: string; pinned: boolean; title: Localized; summary: Localized; date: string }> }) {
  const { locale, t } = useLanguage();
  return (
    <section className="container section" id="announcements">
      <div className="section-head">
        <div className="section-title"><h2>{t("announcements")}</h2><span className="soft-badge">{t("announcementSubtitle")}</span></div>
        <Link className="section-link" href="/announcements">{t("allWorks")}</Link>
      </div>
      <div className="grid-3 snap-row">
        {announcements.slice(0, 3).map((item) => (
          <article className="card announcement-card" key={item.id}>
            <div className="section-title">
              <Megaphone size={19} color="#3F766F" />
              {item.pinned ? <span className="tag pinned">置頂</span> : null}
            </div>
            <h3 className="card-title">{pickLocalizedText(item.title, locale)}</h3>
            <p className="card-desc">{pickLocalizedText(item.summary, locale)}</p>
            <span className="date">{item.date}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
