type Localized = { zhHant?: string | null; zhHans?: string | null; en?: string | null };

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
  cooperationModes: Array<{ mode: string }>;
};

export const fallbackHomeData: HomeViewData = {
  homepageSettings: {
    heroBadge: { zhHant: "平台交易・安心委託・溫柔陪伴", zhHans: "平台交易・安心委托・温柔陪伴", en: "Secure commissions, crafted with care" },
    heroSlogan: { zhHant: "讓每一件手作，都被溫柔對待", zhHans: "让每一件手作，都被温柔对待", en: "Every handmade piece deserves to be treated with warmth." },
    heroSubtitle: {
      zhHant: "我們串起想像與雙手的溫度，從委託到交付，讓美好在信任中誕生。",
      zhHans: "我们串起想象与双手的温度，从委托到交付，让美好在信任中诞生。",
      en: "From commission to delivery, Qin Thread connects imagination, hands, and trust."
    },
    primaryCtaText: { zhHant: "開始委託", zhHans: "开始委托", en: "Start a Commission" },
    primaryCtaUrl: "/works",
    secondaryCtaText: { zhHant: "探索作品", zhHans: "探索作品", en: "Explore Works" },
    secondaryCtaUrl: "/works",
    heroImageUrl: "/brand/hero-qinshixian-yarn.png",
    heroImageAlt: { zhHant: "秦時線毛線與編織工具形象圖", zhHans: "秦时线毛线与编织工具形象图", en: "Qin Thread yarn and knitting tools" },
    showHeroStatCard: false,
    heroStatLabel: { zhHant: "已完成委託", zhHans: "已完成委托", en: "Completed commissions" },
    heroStatValue: "2,341 件",
    heroStatExtra: { zhHant: "好評率 99%", zhHans: "好评率 99%", en: "99% satisfaction" },
    trustPoints: [
      { zhHant: "安心交易", zhHans: "安心交易", en: "Secure Payment" },
      { zhHant: "專業協調", zhHans: "专业协调", en: "Human Coordination" },
      { zhHant: "品質驗收", zhHans: "品质验收", en: "Quality Inspection" }
    ]
  },
  processSteps: [
    { title: { zhHant: "支付訂金", zhHans: "支付订金", en: "Pay Deposit" }, description: { zhHant: "先支付 50% 訂金", zhHans: "先支付 50% 订金", en: "Start with a 50% deposit" } },
    { title: { zhHant: "秦時線協調", zhHans: "秦时线协调", en: "Coordination" }, description: { zhHant: "整理需求與接單節奏", zhHans: "整理需求与接单节奏", en: "Requirements and timing" } },
    { title: { zhHant: "驗收作品", zhHans: "验收作品", en: "Inspection" }, description: { zhHant: "作品先送秦時線確認", zhHans: "作品先送秦时线确认", en: "Reviewed before delivery" } },
    { title: { zhHant: "支付尾款", zhHans: "支付尾款", en: "Pay Balance" }, description: { zhHant: "通過驗收後支付尾款", zhHans: "通过验收后支付尾款", en: "After inspection approval" } },
    { title: { zhHant: "秦時線出貨", zhHans: "秦时线出货", en: "Qin Delivery" }, description: { zhHant: "統一出貨保護隱私", zhHans: "统一出货保护隐私", en: "Privacy-safe shipping" } }
  ],
  announcements: [
    { id: "a1", pinned: true, title: { zhHant: "春季毛線委託活動", zhHans: "春季毛线委托活动", en: "Spring Yarn Commission Event" }, summary: { zhHant: "精選春季配色與委託流程，適合禮物與自用作品。", zhHans: "精选春季配色与委托流程，适合礼物与自用作品。", en: "Seasonal colors and commission guidance for gifts and personal pieces." }, date: "2026.05.13 - 2026.06.30" },
    { id: "a2", pinned: false, title: { zhHant: "新織女入駐招募", zhHans: "新织女入驻招募", en: "Knitter Recruitment" }, summary: { zhHant: "歡迎有穩定作品與接單意願的織女提交資料。", zhHans: "欢迎有稳定作品与接单意愿的织女提交资料。", en: "Knitters with consistent work are welcome to apply." }, date: "2026.05.20" },
    { id: "a3", pinned: false, title: { zhHant: "秦時線自營材料包上新", zhHans: "秦时线自营材料包上新", en: "New Qin Selection Kits" }, summary: { zhHant: "柔霧羊毛線組、初學者工具包與手作禮盒陸續上架。", zhHans: "柔雾羊毛线组、初学者工具包与手作礼盒陆续上架。", en: "Soft wool sets, beginner kits, and gift boxes are arriving." }, date: "2026.05.28" }
  ],
  promotedAds: [
    {
      id: "p1",
      title: { zhHant: "柔霧圍巾訂製", zhHans: "柔雾围巾定制", en: "Soft Mist Scarf" },
      subtitle: { zhHant: "織女付費推廣，已完成秦時線內容審核。", zhHans: "织女付费推广，已完成秦时线内容审核。", en: "Paid placement reviewed by Qin Thread." },
      listingTitle: { zhHant: "雲朵感手織圍巾", zhHans: "云朵感手织围巾", en: "Cloud-soft hand-knit scarf" },
      price: "¥680.00",
      deposit: "¥340.00",
      deliveryDays: 14,
      imageUrl: "/images/ad-yarn.svg",
      href: "/works/p1"
    }
  ],
  commissionListings: [
    { id: "l1", title: { zhHant: "柔霧圍巾訂製", zhHans: "柔雾围巾定制", en: "Soft Mist Scarf" }, price: "¥680.00", deposit: "¥340.00", deliveryDays: 14, mode: "COMMISSION_5", imageUrl: "/images/product-yarn.svg" },
    { id: "l2", title: { zhHant: "莫蘭迪毛線小包", zhHans: "莫兰迪毛线小包", en: "Morandi Yarn Bag" }, price: "¥520.00", deposit: "¥260.00", deliveryDays: 12, mode: "COMMISSION_5", imageUrl: "/images/ad-yarn.svg" },
    { id: "l3", title: { zhHant: "暖心禮物手作", zhHans: "暖心礼物手作", en: "Warm Gift Handmade" }, price: "¥880.00", deposit: "¥440.00", deliveryDays: 18, mode: "COMMISSION_5", imageUrl: "/images/gift-box.svg" },
    { id: "l4", title: { zhHant: "初冬披肩委託", zhHans: "初冬披肩委托", en: "Early Winter Shawl" }, price: "¥980.00", deposit: "¥490.00", deliveryDays: 21, mode: "COMMISSION_5", imageUrl: "/images/hero-yarn.svg" }
  ],
  platformProducts: [
    { id: "pp1", title: { zhHant: "秦時線・柔霧羊毛線組", zhHans: "秦时线・柔雾羊毛线组", en: "Qin Thread Soft Wool Set" }, price: "¥380.00", stock: { zhHant: "庫存 42", zhHans: "库存 42", en: "Stock 42" }, imageUrl: "/images/product-yarn.svg" },
    { id: "pp2", title: { zhHant: "初學者編織工具包", zhHans: "初学者编织工具包", en: "Beginner Knitting Tool Kit" }, price: "¥680.00", stock: { zhHant: "庫存 18", zhHans: "库存 18", en: "Stock 18" }, imageUrl: "/images/ad-yarn.svg" },
    { id: "pp3", title: { zhHant: "莫蘭迪色系毛線組", zhHans: "莫兰迪色系毛线组", en: "Morandi Yarn Set" }, price: "¥520.00", stock: { zhHant: "庫存 26", zhHans: "库存 26", en: "Stock 26" }, imageUrl: "/images/hero-yarn.svg" },
    { id: "pp4", title: { zhHant: "手作禮盒・暖心系列", zhHans: "手作礼盒・暖心系列", en: "Warm Handmade Gift Box" }, price: "¥880.00", stock: { zhHant: "庫存 12", zhHans: "库存 12", en: "Stock 12" }, imageUrl: "/images/gift-box.svg" }
  ],
  cooperationModes: [
    { mode: "COMMISSION_5" },
    { mode: "PLATFORM_BUYOUT_SERVICE" },
    { mode: "READY_MADE_TO_PLATFORM" }
  ]
};

export const homeData = fallbackHomeData;

export function mapApiHome(payload: any): HomeViewData {
  const settings = payload?.homepage_settings;
  const mapped: HomeViewData = {
    ...fallbackHomeData,
    homepageSettings: settings
      ? {
          heroBadge: { zhHant: settings.hero_badge_zh_hant, zhHans: settings.hero_badge_zh_hans, en: settings.hero_badge_en },
          heroSlogan: { zhHant: settings.hero_slogan_zh_hant, zhHans: settings.hero_slogan_zh_hans, en: settings.hero_slogan_en },
          heroSubtitle: { zhHant: settings.hero_subtitle_zh_hant, zhHans: settings.hero_subtitle_zh_hans, en: settings.hero_subtitle_en },
          primaryCtaText: { zhHant: settings.primary_cta_text_zh_hant, zhHans: settings.primary_cta_text_zh_hans, en: settings.primary_cta_text_en },
          primaryCtaUrl: settings.primary_cta_url || "/works",
          secondaryCtaText: { zhHant: settings.secondary_cta_text_zh_hant, zhHans: settings.secondary_cta_text_zh_hans, en: settings.secondary_cta_text_en },
          secondaryCtaUrl: settings.secondary_cta_url || "/works",
          heroImageUrl: settings.hero_image_url || "/brand/hero-qinshixian-yarn.png",
          heroImageAlt: { zhHant: settings.hero_image_alt_zh_hant, zhHans: settings.hero_image_alt_zh_hans, en: settings.hero_image_alt_en },
          showHeroStatCard: Boolean(settings.show_hero_stat_card),
          heroStatLabel: { zhHant: settings.hero_stat_label_zh_hant, zhHans: settings.hero_stat_label_zh_hans, en: settings.hero_stat_label_en },
          heroStatValue: settings.hero_stat_value,
          heroStatExtra: { zhHant: settings.hero_stat_extra_zh_hant, zhHans: settings.hero_stat_extra_zh_hans, en: settings.hero_stat_extra_en },
          trustPoints: [
            { zhHant: settings.trust_point_1_zh_hant, zhHans: settings.trust_point_1_zh_hans, en: settings.trust_point_1_en },
            { zhHant: settings.trust_point_2_zh_hant, zhHans: settings.trust_point_2_zh_hans, en: settings.trust_point_2_en },
            { zhHant: settings.trust_point_3_zh_hant, zhHans: settings.trust_point_3_zh_hans, en: settings.trust_point_3_en }
          ]
        }
      : fallbackHomeData.homepageSettings
  };

  if (Array.isArray(payload?.announcements) && payload.announcements.length) {
    mapped.announcements = payload.announcements.map((item: any) => ({
      id: item.id,
      pinned: Boolean(item.pinned),
      title: { zhHant: item.title_zh_hant, zhHans: item.title_zh_hans, en: item.title_en },
      summary: { zhHant: item.summary_zh_hant, zhHans: item.summary_zh_hans, en: item.summary_en },
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
      title: { zhHant: item.title, zhHans: item.title, en: item.title },
      price: formatCny(item.price_cents ?? 0),
      stock: { zhHant: `庫存 ${item.stock_quantity ?? 0}`, zhHans: `库存 ${item.stock_quantity ?? 0}`, en: `Stock ${item.stock_quantity ?? 0}` },
      imageUrl: item.images?.[0]?.image_url || "/images/product-yarn.svg"
    }));
  }
  if (Array.isArray(payload?.promoted_knitter_ads) && payload.promoted_knitter_ads.length) {
    mapped.promotedAds = payload.promoted_knitter_ads.map((placement: any) => ({
      id: placement.id,
      title: { zhHant: placement.application?.ad_title_zh_hant, zhHans: placement.application?.ad_title_zh_hans, en: placement.application?.ad_title_en },
      subtitle: { zhHant: placement.application?.ad_subtitle_zh_hant, zhHans: placement.application?.ad_subtitle_zh_hans, en: placement.application?.ad_subtitle_en },
      listingTitle: { zhHant: placement.application?.listing?.title, zhHans: placement.application?.listing?.title, en: placement.application?.listing?.title },
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
    title: { zhHant: item.title, zhHans: item.title, en: item.title },
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
