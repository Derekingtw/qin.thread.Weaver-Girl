type Localized = { zhHant?: string | null; zhHans?: string | null };

function formatCny(cents: number) {
  return `¥${(cents / 100).toFixed(2)}`;
}

export type HomeViewData = {
  homepageSettings: {
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
  processSteps: Array<{ title: Localized; description: Localized }>;
  announcements: Array<{ id: string; pinned: boolean; title: Localized; summary: Localized; date: string; imageUrl?: string | null }>;
  promotedAds: Array<{ id: string; title: Localized; subtitle: Localized; listingTitle: Localized; price: string; deposit: string; deliveryDays: number; imageUrl: string; href: string }>;
  commissionListings: Array<{ id: string; title: Localized; price: string; deposit: string; deliveryDays: number; mode: string; imageUrl: string }>;
  platformProducts: Array<{ id: string; title: Localized; price: string; stock: Localized; imageUrl: string }>;
  cooperationModes: Array<{ title: Localized; body: Localized }>;
};

export const fallbackHomeData: HomeViewData = {
  homepageSettings: {
    heroBadge: { zhHant: "平台交易・安心委託・溫柔陪伴", zhHans: "平台交易・安心委托・温柔陪伴" },
    heroSlogan: { zhHant: "讓每一件手作，都被溫柔對待", zhHans: "让每一件手作，都被温柔对待" },
    heroSubtitle: {
      zhHant: "我們串起想像與雙手的溫度，從委託到交付，讓美好在信任中誕生。",
      zhHans: "我们串起想象与双手的温度，从委托到交付，让美好在信任中诞生。"
    },
    primaryCtaText: { zhHant: "開始委託", zhHans: "开始委托" },
    primaryCtaUrl: "/works",
    secondaryCtaText: { zhHant: "探索作品", zhHans: "探索作品" },
    secondaryCtaUrl: "/works",
    heroImageUrl: "/brand/hero-qinshixian-yarn.png",
    heroImageAlt: { zhHant: "秦時線毛線與編織工具形象圖", zhHans: "秦时线毛线与编织工具形象图" },
    showHeroStatCard: false,
    heroStatLabel: { zhHant: "已完成委託", zhHans: "已完成委托" },
    heroStatValue: "2,341 件",
    heroStatExtra: { zhHant: "好評率 99%", zhHans: "好评率 99%" },
    trustPoints: [
      { zhHant: "安心交易", zhHans: "安心交易" },
      { zhHant: "專業協調", zhHans: "专业协调" },
      { zhHant: "品質驗收", zhHans: "品质验收" }
    ]
  },
  processSteps: [
    { title: { zhHant: "支付訂金", zhHans: "支付订金" }, description: { zhHant: "先付訂金鎖定需求", zhHans: "先付订金锁定需求" } },
    { title: { zhHant: "平台協調", zhHans: "平台协调" }, description: { zhHant: "由平台協助溝通", zhHans: "由平台协助沟通" } },
    { title: { zhHant: "驗收作品", zhHans: "验收作品" }, description: { zhHant: "作品先到平台驗收", zhHans: "作品先到平台验收" } },
    { title: { zhHant: "支付尾款", zhHans: "支付尾款" }, description: { zhHant: "確認後支付尾款", zhHans: "确认后支付尾款" } },
    { title: { zhHant: "平台出貨", zhHans: "平台发货" }, description: { zhHant: "平台包裝出貨", zhHans: "平台包装发货" } }
  ],
  announcements: [
    { id: "a1", pinned: true, title: { zhHant: "春季毛線委託活動", zhHans: "春季毛线委托活动" }, summary: { zhHant: "精選春季色系與入門委託流程，平台協調每一步。", zhHans: "精选春季色系与入门委托流程，平台协调每一步。" }, date: "2026.05.13 - 2026.06.30" },
    { id: "a2", pinned: false, title: { zhHant: "新織女入駐招募", zhHans: "新织女入驻招募" }, summary: { zhHant: "提交作品與資料，通過人工審核後即可接單。", zhHans: "提交作品与资料，通过人工审核后即可接单。" }, date: "2026.05.20" },
    { id: "a3", pinned: false, title: { zhHant: "平台自營材料包上新", zhHans: "平台自营材料包上新" }, summary: { zhHant: "柔霧羊毛線組、工具包與暖心禮盒陸續上架。", zhHans: "柔雾羊毛线组、工具包与暖心礼盒陆续上架。" }, date: "2026.05.28" }
  ],
  promotedAds: [
    { id: "p1", title: { zhHant: "青霧線坊・柔霧圍巾主推", zhHans: "青雾线坊・柔雾围巾主推" }, subtitle: { zhHant: "織女付費推廣，僅連至平台內作品詳情頁。", zhHans: "织女付费推广，仅连至平台内作品详情页。" }, listingTitle: { zhHant: "柔霧圍巾訂製", zhHans: "柔雾围巾定制" }, price: "¥680.00", deposit: "¥340.00", deliveryDays: 14, imageUrl: "/images/ad-yarn.svg", href: "/works/p1" }
  ],
  commissionListings: [
    { id: "l1", title: { zhHant: "柔霧圍巾訂製", zhHans: "柔雾围巾定制" }, price: "¥680.00", deposit: "¥340.00", deliveryDays: 14, mode: "COMMISSION_5", imageUrl: "/images/product-yarn.svg" },
    { id: "l2", title: { zhHant: "莫蘭迪毛線小包", zhHans: "莫兰迪毛线小包" }, price: "¥520.00", deposit: "¥260.00", deliveryDays: 12, mode: "COMMISSION_5", imageUrl: "/images/ad-yarn.svg" },
    { id: "l3", title: { zhHant: "暖心禮物手作", zhHans: "暖心礼物手作" }, price: "¥880.00", deposit: "¥440.00", deliveryDays: 18, mode: "COMMISSION_5", imageUrl: "/images/gift-box.svg" },
    { id: "l4", title: { zhHant: "初冬披肩委託", zhHans: "初冬披肩委托" }, price: "¥980.00", deposit: "¥490.00", deliveryDays: 21, mode: "COMMISSION_5", imageUrl: "/images/hero-yarn.svg" }
  ],
  platformProducts: [
    { id: "pp1", title: { zhHant: "秦時線・柔霧羊毛線組", zhHans: "秦时线・柔雾羊毛线组" }, price: "¥380.00", stock: { zhHant: "現貨 42", zhHans: "现货 42" }, imageUrl: "/images/product-yarn.svg" },
    { id: "pp2", title: { zhHant: "初學者編織工具包", zhHans: "初学者编织工具包" }, price: "¥680.00", stock: { zhHant: "現貨 18", zhHans: "现货 18" }, imageUrl: "/images/ad-yarn.svg" },
    { id: "pp3", title: { zhHant: "莫蘭迪色系毛線組", zhHans: "莫兰迪色系毛线组" }, price: "¥520.00", stock: { zhHant: "現貨 26", zhHans: "现货 26" }, imageUrl: "/images/hero-yarn.svg" },
    { id: "pp4", title: { zhHant: "手作禮盒・暖心系列", zhHans: "手作礼盒・暖心系列" }, price: "¥880.00", stock: { zhHant: "現貨 12", zhHans: "现货 12" }, imageUrl: "/images/gift-box.svg" }
  ],
  cooperationModes: [
    { title: { zhHant: "平台抽成 5%", zhHans: "平台抽成 5%" }, body: { zhHant: "織女接單，平台收取 5% 服務費，負責交易與協調。", zhHans: "织女接单，平台收取 5% 服务费，负责交易与协调。" } },
    { title: { zhHant: "平台買斷服務", zhHans: "平台买断服务" }, body: { zhHant: "平台按約定支付織女勞務費，再由平台統一銷售。", zhHans: "平台按约定支付织女劳务费，再由平台统一销售。" } },
    { title: { zhHant: "平台自營庫存", zhHans: "平台自营库存" }, body: { zhHant: "平台管理自營材料包、工具包、成衣現貨與禮盒。", zhHans: "平台管理自营材料包、工具包、成衣现货与礼盒。" } }
  ]
};

export const homeData = fallbackHomeData;

export function mapApiHome(payload: any): HomeViewData {
  const settings = payload?.homepage_settings;
  const mapped: HomeViewData = {
    ...fallbackHomeData,
    homepageSettings: settings
      ? {
          heroBadge: { zhHant: settings.hero_badge_zh_hant, zhHans: settings.hero_badge_zh_hans },
          heroSlogan: { zhHant: settings.hero_slogan_zh_hant, zhHans: settings.hero_slogan_zh_hans },
          heroSubtitle: { zhHant: settings.hero_subtitle_zh_hant, zhHans: settings.hero_subtitle_zh_hans },
          primaryCtaText: { zhHant: settings.primary_cta_text_zh_hant, zhHans: settings.primary_cta_text_zh_hans },
          primaryCtaUrl: settings.primary_cta_url || "/works",
          secondaryCtaText: { zhHant: settings.secondary_cta_text_zh_hant, zhHans: settings.secondary_cta_text_zh_hans },
          secondaryCtaUrl: settings.secondary_cta_url || "/works",
          heroImageUrl: settings.hero_image_url || "/brand/hero-qinshixian-yarn.png",
          heroImageAlt: { zhHant: settings.hero_image_alt_zh_hant, zhHans: settings.hero_image_alt_zh_hans },
          showHeroStatCard: Boolean(settings.show_hero_stat_card),
          heroStatLabel: { zhHant: settings.hero_stat_label_zh_hant, zhHans: settings.hero_stat_label_zh_hans },
          heroStatValue: settings.hero_stat_value,
          heroStatExtra: { zhHant: settings.hero_stat_extra_zh_hant, zhHans: settings.hero_stat_extra_zh_hans },
          trustPoints: [
            { zhHant: settings.trust_point_1_zh_hant, zhHans: settings.trust_point_1_zh_hans },
            { zhHant: settings.trust_point_2_zh_hant, zhHans: settings.trust_point_2_zh_hans },
            { zhHant: settings.trust_point_3_zh_hant, zhHans: settings.trust_point_3_zh_hans }
          ]
        }
      : fallbackHomeData.homepageSettings
  };

  if (Array.isArray(payload?.announcements) && payload.announcements.length) {
    mapped.announcements = payload.announcements.map((item: any) => ({
      id: item.id,
      pinned: Boolean(item.pinned),
      title: { zhHant: item.title_zh_hant, zhHans: item.title_zh_hans },
      summary: { zhHant: item.summary_zh_hant, zhHans: item.summary_zh_hans },
      date: item.starts_at ? new Date(item.starts_at).toLocaleDateString("zh-TW") : "近期",
      imageUrl: item.image_url
    }));
  }

  if (Array.isArray(payload?.hot_commission_listings) && payload.hot_commission_listings.length) {
    mapped.commissionListings = payload.hot_commission_listings.map((item: any) => listingCard(item));
  }
  if (Array.isArray(payload?.platform_products) && payload.platform_products.length) {
    mapped.platformProducts = payload.platform_products.map((item: any) => ({
      id: item.id,
      title: { zhHant: item.title, zhHans: item.title },
      price: formatCny(item.price_cents ?? 0),
      stock: { zhHant: `現貨 ${item.stock_quantity ?? 0}`, zhHans: `现货 ${item.stock_quantity ?? 0}` },
      imageUrl: item.images?.[0]?.image_url || "/images/product-yarn.svg"
    }));
  }
  if (Array.isArray(payload?.promoted_knitter_ads) && payload.promoted_knitter_ads.length) {
    mapped.promotedAds = payload.promoted_knitter_ads.map((placement: any) => ({
      id: placement.id,
      title: { zhHant: placement.application?.ad_title_zh_hant, zhHans: placement.application?.ad_title_zh_hans },
      subtitle: { zhHant: placement.application?.ad_subtitle_zh_hant, zhHans: placement.application?.ad_subtitle_zh_hans },
      listingTitle: { zhHant: placement.application?.listing?.title, zhHans: placement.application?.listing?.title },
      price: formatCny(placement.application?.listing?.price_cents ?? 0),
      deposit: formatCny(Math.round((placement.application?.listing?.price_cents ?? 0) * 0.5)),
      deliveryDays: placement.application?.listing?.delivery_days ?? 14,
      imageUrl: placement.application?.ad_image_url || placement.application?.listing?.images?.[0]?.image_url || "/images/ad-yarn.svg",
      href: `/works/${placement.application?.listing?.id ?? placement.id}`
    }));
  }
  return mapped;
}

function listingCard(item: any) {
  return {
    id: item.id,
    title: { zhHant: item.title, zhHans: item.title },
    price: formatCny(item.price_cents ?? 0),
    deposit: formatCny(Math.round((item.price_cents ?? 0) * 0.5)),
    deliveryDays: item.delivery_days ?? 14,
    mode: item.cooperation_mode ?? "COMMISSION_5",
    imageUrl: item.images?.[0]?.image_url || "/images/product-yarn.svg"
  };
}

export async function getHomeData(): Promise<HomeViewData> {
  const baseUrl = process.env.WEB_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) return fallbackHomeData;
  try {
    const response = await fetch(`${baseUrl}/web/home`, { next: { revalidate: 60 } });
    if (!response.ok) return fallbackHomeData;
    return mapApiHome(await response.json());
  } catch {
    return fallbackHomeData;
  }
}
