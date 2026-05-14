"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { pickLocalizedText, useLanguage } from "../lib/i18n";
import { ImageWithFallback } from "./ImageWithFallback";

type Localized = { zhHant?: string | null; zhHans?: string | null; en?: string | null };
type Product = { id: string; title: Localized; price: string; stock: Localized; imageUrl: string };

export function PlatformProductSection({ products }: { products: Product[] }) {
  const { locale, t } = useLanguage();
  return (
    <section className="container section" id="platform-products">
      <div className="section-head">
        <div className="section-title">
          <h2>{t("platformProductsTitle")}</h2>
          <span className="soft-badge">{t("platformProductsSubtitle")}</span>
        </div>
        <Link className="section-link" href="/platform-products">{t("allProducts")}</Link>
      </div>
      <div className="grid-4 snap-row">
        {products.map((item) => (
          <article className="card listing-card platform-card" key={item.id}>
            <div className="image-frame"><ImageWithFallback src={item.imageUrl} alt={pickLocalizedText(item.title, locale)} /></div>
            <div className="card-body">
              <h3 className="card-title">{pickLocalizedText(item.title, locale)}</h3>
              <div className="price-row">
                <div>
                  <strong className="price">{item.price}</strong>
                  <div className="meta-line"><span>{pickLocalizedText(item.stock, locale)}</span></div>
                </div>
                <button className="cart-button" type="button" aria-label="加入購物車"><ShoppingCart size={18} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
