"use client";

import Link from "next/link";
import { CircleDot, Heart, PackageCheck, ShieldCheck } from "lucide-react";
import { cooperationDescription, cooperationLabel } from "../../lib/cooperationDisplay";
import { useLanguage } from "../../lib/i18n";

const buyerCards = ["分階段付款", "秦時線驗收", "客服協調", "隱私保護", "作品狀態追蹤"];
const knitterCards = ["作品展示", "穩定曝光", "接單管理", "付費推廣", "結算紀錄", "秦時線協調支援"];
const values = [
  ["信任", "交易要有紀錄，流程要有依據。"],
  ["尊重", "尊重買家的期待，也尊重織女的時間與手藝。"],
  ["品質", "手作可以有溫度，也需要基本品質與交付標準。"],
  ["隱私", "買家與織女不直接交換敏感資訊，由秦時線協助溝通。"]
];
const modes = ["COMMISSION_5", "PLATFORM_BUYOUT_SERVICE", "READY_MADE_TO_PLATFORM"];

export default function AboutPage() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  return (
    <main className="brand-page">
      <section className="container page-hero">
        <span className="eyebrow">{isEn ? "About Qin Thread" : "關於秦時線"}</span>
        <h1>{isEn ? "Handmade work is time, care, and trust." : "關於秦時線"}</h1>
        <p>{isEn ? "Qin Thread believes every handmade piece carries time, intention, and the warmth of human hands." : "秦時線相信，手作不只是商品，而是一段時間、一份心意與一雙手的溫度。"}</p>
      </section>

      <section className="container story-band">
        <div>
          <span className="section-kicker">{isEn ? "Brand Story" : "品牌故事"}</span>
          <h2>{isEn ? "From one thread, we connect imagination and hands." : "從一條線，連起想像與雙手"}</h2>
        </div>
        <div className="rich-copy">
          <p>秦時線誕生於對毛線、手作與時間的珍視。我們相信，每一件手作都不是流水線上的商品，而是創作者用時間、經驗與情感慢慢完成的作品。</p>
          <p>在秦時線，買家不只是購買成品，而是委託一份期待；織女不只是接單，而是讓手上的技藝被看見、被尊重、被合理對待。</p>
          <p>秦時線希望成為買家與織女之間的信任橋樑，讓委託、製作、驗收與交付都能在更安心的流程中完成。</p>
        </div>
      </section>

      <section className="container section about-grid">
        <article className="card about-feature">
          <CircleDot />
          <h2>{isEn ? "What We Do" : "我們在做一個更安心的手作委託系統"}</h2>
          <p>秦時線以平台化流程協助毛線手作交易，提供作品展示、織女審核、買家委託、訂金尾款、作品驗收、客服協調、織女結算與自營選品等服務。</p>
          <p>我們不是單純的商品展示網站，也不是買賣雙方自由私聊的媒合站，而是一套重視信任、品質與隱私的手作委託服務。</p>
        </article>
        <article className="card about-feature">
          <ShieldCheck />
          <h2>{isEn ? "For Buyers" : "給買家：安心委託，而不是盲目下單"}</h2>
          <div className="pill-row">{buyerCards.map((item) => <span className="tag" key={item}>{item}</span>)}</div>
          <p>買家可以透過秦時線找到適合的織女作品，支付訂金後，由秦時線協助追蹤製作、驗收作品並安排尾款與出貨。</p>
        </article>
        <article className="card about-feature">
          <Heart />
          <h2>{isEn ? "For Knitters" : "給織女：讓手作價值被看見"}</h2>
          <div className="pill-row">{knitterCards.map((item) => <span className="tag" key={item}>{item}</span>)}</div>
          <p>秦時線希望讓認真創作的織女，不再只依賴零散私訊與不穩定曝光，而是能透過更完整的流程接觸買家、展示作品並獲得合理收入。</p>
        </article>
      </section>

      <section className="container section" id="cooperation">
        <div className="section-head"><h2>{isEn ? "Ways to Work With Us" : "我們的三種合作方式"}</h2></div>
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
        <div className="section-head"><h2>{isEn ? "Our Values" : "我們的堅持"}</h2></div>
        <div className="grid-4 value-grid">
          {values.map(([title, body]) => (
            <article className="card value-card" key={title}>
              <PackageCheck size={24} />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container final-cta">
        <h2>{isEn ? "Every handmade piece deserves care." : "讓每一件手作，都被好好對待"}</h2>
        <div className="actions">
          <Link className="btn primary" href="/works">{isEn ? "Start a Commission" : "開始委託作品"}</Link>
          <Link className="btn" href="/register/knitter">{isEn ? "Join as Knitter" : "申請成為織女"}</Link>
        </div>
      </section>
    </main>
  );
}
