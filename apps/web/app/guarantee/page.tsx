"use client";

import Link from "next/link";
import { CreditCard, MessageCircle, PackageCheck, SearchCheck, ShieldCheck, Truck } from "lucide-react";
import { useLanguage, type Locale } from "../../lib/i18n";

type Rule = { title: Record<Locale, string>; items: Record<Locale, string[]> };

const icons = [SearchCheck, CreditCard, MessageCircle, PackageCheck, CreditCard, Truck, ShieldCheck, MessageCircle, SearchCheck, PackageCheck];

const rules: Rule[] = [
  {
    title: { "zh-Hant": "委託前，秦時線協助確認需求", "zh-Hans": "委托前，秦时线协助确认需求", en: "Before Commission: Requirement Check" },
    items: {
      "zh-Hant": ["買家在下單前可查看作品價格、訂金比例、交貨天數、合作模式與作品說明。", "秦時線會要求織女明確填寫接單後幾天內交貨。", "織女作品上架前需經秦時線審核。", "作品描述不得留下手機、微信、Email、LINE、Telegram、QQ 等私下聯絡方式。", "買家與織女不直接聯繫，需求由秦時線客服協助整理與確認。"],
      "zh-Hans": ["买家在下单前可查看作品价格、订金比例、交货天数、合作模式与作品说明。", "秦时线会要求织女明确填写接单后几天内交货。", "织女作品上架前需经秦时线审核。", "作品描述不得留下手机、微信、Email、LINE、Telegram、QQ 等私下联系方式。", "买家与织女不直接联系，需求由秦时线客服协助整理与确认。"],
      en: ["Buyers can review price, deposit ratio, delivery days, cooperation mode, and work description before ordering.", "Knitters must state delivery timing after accepting an order.", "Works require Qin Thread review before listing.", "Descriptions may not include private contact details.", "Buyer and knitter requirements are coordinated by Qin Thread support."]
    }
  },
  {
    title: { "zh-Hant": "訂金分階段支付，降低雙方風險", "zh-Hans": "订金分阶段支付，降低双方风险", en: "Deposit Protection" },
    items: {
      "zh-Hant": ["買家下單時先支付作品總價 50% 作為訂金。", "訂金支付後，訂單才正式進入接單流程。", "織女接單後，系統開始計算交貨期限。", "若織女未接單或訂單無法成立，秦時線可依規則協助取消或退款。", "訂金、尾款、廣告費等支付紀錄均需保留完整交易紀錄。"],
      "zh-Hans": ["买家下单时先支付作品总价 50% 作为订金。", "订金支付后，订单才正式进入接单流程。", "织女接单后，系统开始计算交货期限。", "若织女未接单或订单无法成立，秦时线可依规则协助取消或退款。", "订金、尾款、广告费等支付记录均需保留完整交易记录。"],
      en: ["Buyers first pay 50% of the total price as deposit.", "Orders enter the acceptance process only after deposit payment.", "Delivery timing starts after knitter acceptance.", "If the order cannot be formed, Qin Thread can assist cancellation or refund by rule.", "Deposit, balance, and ad-fee records are preserved."]
    }
  },
  {
    title: { "zh-Hant": "製作過程由秦時線協調追蹤", "zh-Hans": "制作过程由秦时线协调追踪", en: "Production Tracking" },
    items: {
      "zh-Hant": ["織女確認接單後，需依承諾交貨天數完成作品。", "秦時線後台會記錄接單時間、交貨期限與訂單狀態。", "若訂單即將逾期，秦時線可主動提醒與介入。", "買家與織女不直接溝通，避免私下交易、爭議與資訊外洩。", "所有溝通紀錄以客服工單形式保留。"],
      "zh-Hans": ["织女确认接单后，需依承诺交货天数完成作品。", "秦时线后台会记录接单时间、交货期限与订单状态。", "若订单即将逾期，秦时线可主动提醒与介入。", "买家与织女不直接沟通，避免私下交易、争议与信息外泄。", "所有沟通记录以客服工单形式保留。"],
      en: ["Knitters complete work within the committed delivery days.", "Qin Thread records acceptance time, deadline, and order status.", "Qin Thread can remind or intervene before overdue orders.", "Direct private communication is avoided.", "Support tickets preserve communication records."]
    }
  },
  {
    title: { "zh-Hant": "作品先送秦時線驗收，再通知尾款", "zh-Hans": "作品先送秦时线验收，再通知尾款", en: "Inspection Protection" },
    items: {
      "zh-Hant": ["織女完成作品後，應依流程寄送至秦時線指定驗收點。", "秦時線會依作品描述、訂單約定、基本品質與完整度進行確認。", "驗收通過後，秦時線通知買家支付尾款。", "未經驗收的作品，不應直接進入尾款支付與出貨流程。", "如作品與描述明顯不符，秦時線可協調修改、補件、延後尾款或啟動爭議處理。"],
      "zh-Hans": ["织女完成作品后，应依流程寄送至秦时线指定验收点。", "秦时线会依作品描述、订单约定、基本品质与完整度进行确认。", "验收通过后，秦时线通知买家支付尾款。", "未经验收的作品，不应直接进入尾款支付与出货流程。", "如作品与描述明显不符，秦时线可协调修改、补件、延后尾款或启动争议处理。"],
      en: ["Finished work is sent to Qin Thread's inspection point.", "Qin Thread checks description, order agreement, quality, and completeness.", "Balance payment is requested only after inspection.", "Uninspected work does not proceed to shipping.", "Qin Thread can coordinate corrections, delay balance, or open dispute handling."]
    }
  },
  {
    title: { "zh-Hant": "驗收通過後，買家再支付尾款", "zh-Hans": "验收通过后，买家再支付尾款", en: "Balance Protection" },
    items: {
      "zh-Hant": ["買家在秦時線驗收通過後支付尾款。", "尾款支付完成後，秦時線安排出貨。", "若尾款逾期未支付，秦時線可依訂單規則提醒、暫停出貨或啟動客服處理。", "尾款支付狀態必須寫入支付紀錄，避免重複入帳。"],
      "zh-Hans": ["买家在秦时线验收通过后支付尾款。", "尾款支付完成后，秦时线安排出货。", "若尾款逾期未支付，秦时线可依订单规则提醒、暂停出货或启动客服处理。", "尾款支付状态必须写入支付记录，避免重复入账。"],
      en: ["Buyers pay the balance after Qin Thread inspection.", "Shipping starts after balance payment.", "If the balance is overdue, Qin Thread can remind, pause shipping, or start support handling.", "Payment status is recorded to avoid duplicate posting."]
    }
  },
  {
    title: { "zh-Hant": "秦時線統一出貨，保護雙方隱私", "zh-Hans": "秦时线统一出货，保护双方隐私", en: "Shipping Privacy" },
    items: {
      "zh-Hant": ["第一版物流流程採用「織女寄至秦時線，秦時線再寄給買家」。", "織女不直接取得買家完整地址。", "買家不取得織女真實地址與聯絡資訊。", "秦時線可記錄出貨狀態、物流資訊與交付結果。", "出貨完成後，訂單進入完成或售後階段。"],
      "zh-Hans": ["第一版物流流程采用「织女寄至秦时线，秦时线再寄给买家」。", "织女不直接取得买家完整地址。", "买家不取得织女真实地址与联系方式。", "秦时线可记录出货状态、物流信息与交付结果。", "出货完成后，订单进入完成或售后阶段。"],
      en: ["The first logistics flow is knitter to Qin Thread, then Qin Thread to buyer.", "Knitters do not receive full buyer addresses.", "Buyers do not receive knitter address or contact details.", "Qin Thread records shipment status and delivery result.", "After shipping, the order enters completion or after-sales."]
    }
  },
  {
    title: { "zh-Hant": "買家與織女資料彼此隔離", "zh-Hans": "买家与织女资料彼此隔离", en: "Privacy Protection" },
    items: {
      "zh-Hant": ["買家不得查看織女手機、微信、地址、收款資料。", "織女不得查看買家手機、姓名、地址。", "雙方不得直接聊天。", "所有訊息透過秦時線客服工單處理。", "手機號不得明文保存，需使用 phone_hash 查重與 phone_encrypted 加密保存。", "織女收款資料僅限財務或超級管理員查看。", "買家地址僅限營運或超級管理員查看。"],
      "zh-Hans": ["买家不得查看织女手机、微信、地址、收款资料。", "织女不得查看买家手机、姓名、地址。", "双方不得直接聊天。", "所有消息透过秦时线客服工单处理。", "手机号不得明文保存，需使用 phone_hash 查重与 phone_encrypted 加密保存。", "织女收款资料仅限财务或超级管理员查看。", "买家地址仅限运营或超级管理员查看。"],
      en: ["Buyers cannot view knitter phone, social contact, address, or payout data.", "Knitters cannot view buyer phone, name, or address.", "No direct chat is allowed.", "Messages go through Qin Thread support tickets.", "Phone numbers use phone_hash and phone_encrypted, not plaintext.", "Sensitive payout and address data is role-limited."]
    }
  },
  {
    title: { "zh-Hant": "發生爭議時，由秦時線介入處理", "zh-Hans": "发生争议时，由秦时线介入处理", en: "After-sales and Disputes" },
    items: {
      "zh-Hant": ["若作品延遲、描述不符、驗收異常或交付爭議，買家或織女可提交客服工單。", "秦時線可根據訂單紀錄、支付紀錄、作品描述、驗收結果與客服紀錄判斷處理方式。", "爭議處理方式可包括：補件、修改、延後尾款、取消訂單、部分退款、全額退款或其他協議方案。", "爭議訂單需標記為 DISPUTED。", "所有處理過程應保留 audit_logs 與 order_status_logs。"],
      "zh-Hans": ["若作品延迟、描述不符、验收异常或交付争议，买家或织女可提交客服工单。", "秦时线可根据订单记录、支付记录、作品描述、验收结果与客服记录判断处理方式。", "争议处理方式可包括：补件、修改、延后尾款、取消订单、部分退款、全额退款或其他协议方案。", "争议订单需标记为 DISPUTED。", "所有处理过程应保留 audit_logs 与 order_status_logs。"],
      en: ["Buyer or knitter can submit support tickets for delay, mismatch, inspection issue, or delivery dispute.", "Qin Thread reviews order, payment, description, inspection, and support records.", "Resolution can include repair, modification, delayed balance, cancellation, partial refund, full refund, or other agreement.", "Disputed orders are marked DISPUTED.", "Handling is preserved in audit and order-status logs."]
    }
  },
  {
    title: { "zh-Hant": "織女需人工審核後才能接單", "zh-Hans": "织女需人工审核后才能接单", en: "Knitter Review" },
    items: {
      "zh-Hant": ["織女註冊後狀態為待審核。", "未審核織女不得發布作品、接單或申請推廣。", "秦時線可審核織女作品、擅長品類、簡介與收款資料。", "審核不通過時，應提供原因。", "審核通過後，織女才可正式參與委託與交易。"],
      "zh-Hans": ["织女注册后状态为待审核。", "未审核织女不得发布作品、接单或申请推广。", "秦时线可审核织女作品、擅长品类、简介与收款资料。", "审核不通过时，应提供原因。", "审核通过后，织女才可正式参与委托与交易。"],
      en: ["New knitters are pending review.", "Pending knitters cannot publish, accept orders, or apply for promotion.", "Qin Thread reviews works, categories, bio, and payout data.", "Rejections should include reasons.", "Only approved knitters can participate in commissions and transactions."]
    }
  },
  {
    title: { "zh-Hant": "織女付費推廣需審核後才展示", "zh-Hans": "织女付费推广需审核后才展示", en: "Paid Promotion Review" },
    items: {
      "zh-Hant": ["織女可付費申請首頁三格推廣位。", "推廣內容需經秦時線審核。", "審核通過後才進入付款流程。", "未付款不得展示。", "廣告內容不得包含私下聯絡方式。", "推廣卡片需明確標示「織女付費推廣」。", "廣告費屬秦時線收入，不進入織女結算。"],
      "zh-Hans": ["织女可付费申请首页三格推广位。", "推广内容需经秦时线审核。", "审核通过后才进入付款流程。", "未付款不得展示。", "广告内容不得包含私下联系方式。", "推广卡片需明确标示「织女付费推广」。", "广告费属秦时线收入，不进入织女结算。"],
      en: ["Knitters can apply for three paid home placements.", "Promotion content requires Qin Thread review.", "Payment starts after approval.", "Unpaid ads are not displayed.", "Ads may not contain private contact details.", "Promotion cards must be clearly marked Paid Promotion.", "Ad fees are Qin Thread revenue and do not enter knitter settlement."]
    }
  }
];

const summary: Record<Locale, string[]> = {
  "zh-Hant": ["委託確認", "訂金保障", "作品驗收", "隱私隔離"],
  "zh-Hans": ["委托确认", "订金保障", "作品验收", "隐私隔离"],
  en: ["Requirements", "Deposit", "Inspection", "Privacy"]
};

function text<T>(value: Record<Locale, T>, locale: Locale): T {
  return value[locale] || value["zh-Hant"];
}

export default function GuaranteePage() {
  const { locale } = useLanguage();

  return (
    <main className="brand-page guarantee-page">
      <section className="container page-hero">
        <span className="eyebrow">{locale === "en" ? "Qin Guarantee" : locale === "zh-Hans" ? "秦时线保障" : "秦時線保障"}</span>
        <h1>{locale === "en" ? "Qin Guarantee" : locale === "zh-Hans" ? "秦时线保障" : "秦時線保障"}</h1>
        <p>{locale === "en" ? "From commission to delivery, Qin Thread uses staged payment, inspection, privacy protection, and human coordination to protect each handmade transaction." : locale === "zh-Hans" ? "从委托、制作、验收、付款到交付，秦时线以分阶段流程与人工协调，守护每一次手作交易。" : "從委託、製作、驗收、付款到交付，秦時線以分階段流程與人工協調，守護每一次手作交易。"}</p>
      </section>

      <section className="container guarantee-summary">
        {text(summary, locale).map((item) => (
          <div className="summary-chip" key={item}><ShieldCheck size={18} />{item}</div>
        ))}
      </section>

      <section className="container guarantee-grid">
        {rules.map((rule, index) => {
          const Icon = icons[index] || ShieldCheck;
          return (
            <article className="card guarantee-card" key={text(rule.title, locale)}>
              <div className="guarantee-card-head">
                <div className="mode-illustration"><Icon size={30} /></div>
                <small>{String(index + 1).padStart(2, "0")}</small>
              </div>
              <h2>{text(rule.title, locale)}</h2>
              <ul>
                {text(rule.items, locale).map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          );
        })}
      </section>

      <section className="container final-cta">
        <h2>{locale === "en" ? "Commission with a clearer, calmer process." : locale === "zh-Hans" ? "让每一次委托，都有更清楚安心的流程。" : "讓每一次委託，都有更清楚安心的流程。"}</h2>
        <div className="actions">
          <Link className="btn primary" href="/works">{locale === "en" ? "Start a Commission" : locale === "zh-Hans" ? "开始委托作品" : "開始委託作品"}</Link>
          <Link className="btn" href="/register/knitter">{locale === "en" ? "Join as Knitter" : locale === "zh-Hans" ? "申请成为织女" : "申請成為織女"}</Link>
        </div>
      </section>
    </main>
  );
}
