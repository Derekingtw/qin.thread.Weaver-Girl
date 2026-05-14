"use client";

import Link from "next/link";
import { CircleDot, Heart, PackageCheck, ShieldCheck } from "lucide-react";
import { cooperationDescription, cooperationLabel } from "../../lib/cooperationDisplay";
import { useLanguage, type Locale } from "../../lib/i18n";

const modes = ["COMMISSION_5", "PLATFORM_BUYOUT_SERVICE", "READY_MADE_TO_PLATFORM"];

const copy = {
  title: {
    "zh-Hant": "關於秦時線",
    "zh-Hans": "关于秦时线",
    en: "About Qin Thread"
  },
  subtitle: {
    "zh-Hant": "秦時線相信，手作不只是商品，而是一段時間、一份心意與一雙手的溫度。",
    "zh-Hans": "秦时线相信，手作不只是商品，而是一段时间、一份心意与一双手的温度。",
    en: "Qin Thread believes handmade work is not only a product, but time, care, and the warmth of human hands."
  },
  storyTitle: {
    "zh-Hant": "從一條線，連起想像與雙手",
    "zh-Hans": "从一条线，连起想象与双手",
    en: "From one thread, we connect imagination and hands."
  },
  story: {
    "zh-Hant": [
      "秦時線誕生於對毛線、手作與時間的珍視。我們相信，每一件手作都不是流水線上的商品，而是創作者用時間、經驗與情感慢慢完成的作品。",
      "在秦時線，買家不只是購買成品，而是委託一份期待；織女不只是接單，而是讓手上的技藝被看見、被尊重、被合理對待。",
      "秦時線希望成為買家與織女之間的信任橋樑，讓委託、製作、驗收與交付都能在更安心的流程中完成。"
    ],
    "zh-Hans": [
      "秦时线诞生于对毛线、手作与时间的珍视。我们相信，每一件手作都不是流水线上的商品，而是创作者用时间、经验与情感慢慢完成的作品。",
      "在秦时线，买家不只是购买成品，而是委托一份期待；织女不只是接单，而是让手上的技艺被看见、被尊重、被合理对待。",
      "秦时线希望成为买家与织女之间的信任桥梁，让委托、制作、验收与交付都能在更安心的流程中完成。"
    ],
    en: [
      "Qin Thread began with respect for yarn, craft, and time. Every handmade piece carries experience, patience, and feeling.",
      "Here, buyers commission an expectation, while knitters bring skill into a process where their work can be seen and respected.",
      "Qin Thread is a trust bridge between buyers and knitters, making commission, making, inspection, and delivery calmer and clearer."
    ]
  }
};

const buyerCards: Record<Locale, string[]> = {
  "zh-Hant": ["分階段付款", "秦時線驗收", "客服協調", "隱私保護", "作品狀態追蹤"],
  "zh-Hans": ["分阶段付款", "秦时线验收", "客服协调", "隐私保护", "作品状态追踪"],
  en: ["Staged payment", "Qin inspection", "Support coordination", "Privacy protection", "Status tracking"]
};

const knitterCards: Record<Locale, string[]> = {
  "zh-Hant": ["作品展示", "穩定曝光", "接單管理", "付費推廣", "結算紀錄", "秦時線協調支援"],
  "zh-Hans": ["作品展示", "稳定曝光", "接单管理", "付费推广", "结算记录", "秦时线协调支持"],
  en: ["Portfolio", "Exposure", "Order management", "Paid promotion", "Settlement records", "Qin support"]
};

const values: Record<Locale, Array<[string, string]>> = {
  "zh-Hant": [
    ["信任", "交易要有紀錄，流程要有依據。"],
    ["尊重", "尊重買家的期待，也尊重織女的時間與手藝。"],
    ["品質", "手作可以有溫度，也需要基本品質與交付標準。"],
    ["隱私", "買家與織女不直接交換敏感資訊，由秦時線協助溝通。"]
  ],
  "zh-Hans": [
    ["信任", "交易要有记录，流程要有依据。"],
    ["尊重", "尊重买家的期待，也尊重织女的时间与手艺。"],
    ["品质", "手作可以有温度，也需要基本品质与交付标准。"],
    ["隐私", "买家与织女不直接交换敏感信息，由秦时线协助沟通。"]
  ],
  en: [
    ["Trust", "Transactions need records and processes need evidence."],
    ["Respect", "We respect buyer expectations and the time behind craft."],
    ["Quality", "Warm handmade work still deserves standards."],
    ["Privacy", "Sensitive buyer and knitter information stays separated."]
  ]
};

function text<T>(value: Record<Locale, T>, locale: Locale): T {
  return value[locale] || value["zh-Hant"];
}

export default function AboutPage() {
  const { locale } = useLanguage();

  return (
    <main className="brand-page">
      <section className="container page-hero">
        <span className="eyebrow">{text(copy.title, locale)}</span>
        <h1>{text(copy.title, locale)}</h1>
        <p>{text(copy.subtitle, locale)}</p>
      </section>

      <section className="container story-band">
        <div>
          <span className="section-kicker">{locale === "en" ? "Brand Story" : "品牌故事"}</span>
          <h2>{text(copy.storyTitle, locale)}</h2>
        </div>
        <div className="rich-copy">
          {text(copy.story, locale).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <section className="container section about-grid">
        <article className="card about-feature">
          <CircleDot />
          <h2>{locale === "en" ? "What We Do" : locale === "zh-Hans" ? "我们在做一个更安心的手作委托系统" : "我們在做一個更安心的手作委託系統"}</h2>
          <p>{locale === "en" ? "Qin Thread supports handmade transactions with work display, knitter review, buyer commissions, deposits and balances, inspection, support coordination, settlements, and curated selection." : locale === "zh-Hans" ? "秦时线以流程化方式协助毛线手作交易，提供作品展示、织女审核、买家委托、订金尾款、作品验收、客服协调、织女结算与自营选品等服务。" : "秦時線以流程化方式協助毛線手作交易，提供作品展示、織女審核、買家委託、訂金尾款、作品驗收、客服協調、織女結算與自營選品等服務。"}</p>
        </article>
        <article className="card about-feature">
          <ShieldCheck />
          <h2>{locale === "en" ? "For Buyers" : locale === "zh-Hans" ? "给买家：安心委托，而不是盲目下单" : "給買家：安心委託，而不是盲目下單"}</h2>
          <div className="pill-row">{text(buyerCards, locale).map((item) => <span className="tag" key={item}>{item}</span>)}</div>
          <p>{locale === "en" ? "Buyers can find suitable works, pay a deposit, and let Qin Thread coordinate production, inspection, balance payment, and delivery." : locale === "zh-Hans" ? "买家可以透过秦时线找到适合的织女作品，支付订金后，由秦时线协助追踪制作、验收作品并安排尾款与出货。" : "買家可以透過秦時線找到適合的織女作品，支付訂金後，由秦時線協助追蹤製作、驗收作品並安排尾款與出貨。"}</p>
        </article>
        <article className="card about-feature">
          <Heart />
          <h2>{locale === "en" ? "For Knitters" : locale === "zh-Hans" ? "给织女：让手作价值被看见" : "給織女：讓手作價值被看見"}</h2>
          <div className="pill-row">{text(knitterCards, locale).map((item) => <span className="tag" key={item}>{item}</span>)}</div>
          <p>{locale === "en" ? "Qin Thread helps serious knitters move beyond scattered messages and unstable exposure into a clearer way to present work, receive commissions, and earn fairly." : locale === "zh-Hans" ? "秦时线希望让认真创作的织女，不再只依赖零散私讯与不稳定曝光，而是能透过更完整的流程接触买家、展示作品并获得合理收入。" : "秦時線希望讓認真創作的織女，不再只依賴零散私訊與不穩定曝光，而是能透過更完整的流程接觸買家、展示作品並獲得合理收入。"}</p>
        </article>
      </section>

      <section className="container section" id="cooperation">
        <div className="section-head"><h2>{locale === "en" ? "Ways to Work With Us" : locale === "zh-Hans" ? "我们的三种合作方式" : "我們的三種合作方式"}</h2></div>
        <div className="grid-3">
          {modes.map((mode) => (
            <article className="card mode-card" key={mode}>
              <div className="mode-illustration"><CircleDot size={36} /></div>
              <div>
                <h3>{cooperationLabel(mode, locale)}</h3>
                <p className="card-desc">{cooperationDescription(mode, locale)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head"><h2>{locale === "en" ? "Our Values" : locale === "zh-Hans" ? "我们的坚持" : "我們的堅持"}</h2></div>
        <div className="grid-4 value-grid">
          {text(values, locale).map(([title, body]) => (
            <article className="card value-card" key={title}>
              <PackageCheck size={24} />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container final-cta">
        <h2>{locale === "en" ? "Every handmade piece deserves care." : locale === "zh-Hans" ? "让每一件手作，都被好好对待" : "讓每一件手作，都被好好對待"}</h2>
        <div className="actions">
          <Link className="btn primary" href="/works">{locale === "en" ? "Start a Commission" : locale === "zh-Hans" ? "开始委托作品" : "開始委託作品"}</Link>
          <Link className="btn" href="/register/knitter">{locale === "en" ? "Join as Knitter" : locale === "zh-Hans" ? "申请成为织女" : "申請成為織女"}</Link>
        </div>
      </section>
    </main>
  );
}
