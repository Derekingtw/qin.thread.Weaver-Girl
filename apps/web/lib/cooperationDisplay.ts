import type { Locale } from "./i18n";

const labels: Record<string, Record<Locale, string>> = {
  COMMISSION_5: {
    "zh-Hant": "秦時線抽成委託",
    "zh-Hans": "秦时线抽成委托",
    en: "Commission-based Service"
  },
  PLATFORM_BUYOUT_SERVICE: {
    "zh-Hant": "秦時線買斷服務",
    "zh-Hans": "秦时线买断服务",
    en: "Platform Buyout Service"
  },
  READY_MADE_TO_PLATFORM: {
    "zh-Hant": "成衣收購",
    "zh-Hans": "成衣收购",
    en: "Ready-made Purchase"
  },
  PLATFORM_OWNED_INVENTORY: {
    "zh-Hant": "秦時線自營選品",
    "zh-Hans": "秦时线自营选品",
    en: "Qin Selection"
  }
};

const descriptions: Record<string, Record<Locale, string>> = {
  COMMISSION_5: {
    "zh-Hant": "織女自主定價，秦時線協助訂單流程、需求確認、品質驗收與交易保障。作品完成並交付後，秦時線依成交金額收取服務佣金。",
    "zh-Hans": "织女自主定价，秦时线协助订单流程、需求确认、品质验收与交易保障。作品完成并交付后，秦时线依成交金额收取服务佣金。",
    en: "Knitters set their own price while Qin Thread coordinates requirements, inspection, and transaction protection. Qin Thread collects a service commission after delivery."
  },
  PLATFORM_BUYOUT_SERVICE: {
    "zh-Hant": "秦時線依品牌企劃或商品需求，與織女合作完成指定編織服務。織女獲得固定手工費，後續銷售與商品營運由秦時線負責。",
    "zh-Hans": "秦时线依品牌企划或商品需求，与织女合作完成指定编织服务。织女获得固定手工费，后续销售与商品运营由秦时线负责。",
    en: "Qin Thread commissions selected knitting work for brand or product plans. The knitter receives a fixed craft fee while Qin Thread manages sales and operations."
  },
  READY_MADE_TO_PLATFORM: {
    "zh-Hant": "織女可提交已完成的成衣作品，由秦時線審核品質、風格與市場需求後進行一次性收購，作品後續納入秦時線自營選品。",
    "zh-Hans": "织女可提交已完成的成衣作品，由秦时线审核品质、风格与市场需求后进行一次性收购，作品后续纳入秦时线自营选品。",
    en: "Finished pieces can be purchased after Qin Thread reviews quality, style, and market fit, then become part of Qin Selection."
  }
};

export function cooperationLabel(mode: string, locale: Locale) {
  return labels[mode]?.[locale] || labels[mode]?.["zh-Hant"] || mode;
}

export function cooperationDescription(mode: string, locale: Locale) {
  return descriptions[mode]?.[locale] || descriptions[mode]?.["zh-Hant"] || "";
}
