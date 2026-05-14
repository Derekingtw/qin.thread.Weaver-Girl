import { CooperationMode } from "./enums.js";
import { Locale, normalizeLocale } from "./i18n/locales.js";

export type CooperationModeCode = CooperationMode | keyof typeof cooperationModeDisplayMap | string;

type LocalizedCopy = Record<Locale, string>;
type CooperationDisplay = {
  label: LocalizedCopy;
  description: LocalizedCopy;
};

export const cooperationModeDisplayMap: Record<string, CooperationDisplay> = {
  COMMISSION_5: {
    label: {
      [Locale.ZH_HANT]: "秦時線抽成委託",
      [Locale.ZH_HANS]: "秦时线抽成委托",
      [Locale.EN]: "Commission-based Service"
    },
    description: {
      [Locale.ZH_HANT]: "織女自主定價，秦時線協助訂單流程、需求確認、品質驗收與交易保障。作品完成並交付後，秦時線依成交金額收取服務佣金。",
      [Locale.ZH_HANS]: "织女自主定价，秦时线协助订单流程、需求确认、品质验收与交易保障。作品完成并交付后，秦时线依成交金额收取服务佣金。",
      [Locale.EN]: "Knitters set their own price while Qin Thread coordinates the order flow, requirements, inspection, and transaction protection. A service commission is charged after delivery."
    }
  },
  PLATFORM_BUYOUT_SERVICE: {
    label: {
      [Locale.ZH_HANT]: "秦時線買斷服務",
      [Locale.ZH_HANS]: "秦时线买断服务",
      [Locale.EN]: "Platform Buyout Service"
    },
    description: {
      [Locale.ZH_HANT]: "秦時線依品牌企劃或商品需求，與織女合作完成指定編織服務。織女獲得固定手工費，後續銷售與商品營運由秦時線負責。",
      [Locale.ZH_HANS]: "秦时线依品牌企划或商品需求，与织女合作完成指定编织服务。织女获得固定手工费，后续销售与商品运营由秦时线负责。",
      [Locale.EN]: "Qin Thread commissions selected knitting work for brand or product plans. The knitter receives a fixed labor fee, while Qin Thread manages sales and operations."
    }
  },
  READY_MADE_TO_PLATFORM: {
    label: {
      [Locale.ZH_HANT]: "成衣收購",
      [Locale.ZH_HANS]: "成衣收购",
      [Locale.EN]: "Ready-made Purchase"
    },
    description: {
      [Locale.ZH_HANT]: "織女可提交已完成的成衣作品，由秦時線審核品質、風格與市場需求後進行一次性收購，作品後續納入秦時線自營選品。",
      [Locale.ZH_HANS]: "织女可提交已完成的成衣作品，由秦时线审核品质、风格与市场需求后进行一次性收购，作品后续纳入秦时线自营选品。",
      [Locale.EN]: "Knitters can submit finished pieces for one-time purchase after Qin Thread reviews quality, style, and market fit. Approved pieces join Qin Selection."
    }
  },
  PLATFORM_OWNED_INVENTORY: {
    label: {
      [Locale.ZH_HANT]: "秦時線自營選品",
      [Locale.ZH_HANS]: "秦时线自营选品",
      [Locale.EN]: "Qin Selection"
    },
    description: {
      [Locale.ZH_HANT]: "由秦時線企劃、採購或買斷管理的材料包、工具、禮盒與成衣現貨。",
      [Locale.ZH_HANS]: "由秦时线企划、采购或买断管理的材料包、工具、礼盒与成衣现货。",
      [Locale.EN]: "Kits, tools, gift sets, and ready-made inventory planned, sourced, or owned by Qin Thread."
    }
  }
};

export function getCooperationModeDisplay(mode: CooperationModeCode, locale?: string | null) {
  const normalized = normalizeLocale(locale);
  return cooperationModeDisplayMap[String(mode)]?.label[normalized] ?? String(mode);
}

export function getCooperationModeDescription(mode: CooperationModeCode, locale?: string | null) {
  const normalized = normalizeLocale(locale);
  return cooperationModeDisplayMap[String(mode)]?.description[normalized] ?? "";
}
