"use client";

import Link from "next/link";
import { CreditCard, MessageCircle, PackageCheck, SearchCheck, ShieldCheck, Truck } from "lucide-react";
import { useLanguage } from "../../lib/i18n";

const icons = [SearchCheck, CreditCard, MessageCircle, PackageCheck, CreditCard, Truck, ShieldCheck, MessageCircle, SearchCheck, PackageCheck];
const rules = [
  {
    title: "委託前，秦時線協助確認需求",
    items: [
      "買家在下單前可查看作品價格、訂金比例、交貨天數、合作模式與作品說明。",
      "秦時線會要求織女明確填寫接單後幾天內交貨。",
      "織女作品上架前需經秦時線審核。",
      "作品描述不得留下手機、微信、Email、LINE、Telegram、QQ 等私下聯絡方式。",
      "買家與織女不直接聯繫，需求由秦時線客服協助整理與確認。"
    ]
  },
  {
    title: "訂金分階段支付，降低雙方風險",
    items: [
      "買家下單時先支付作品總價 50% 作為訂金。",
      "訂金支付後，訂單才正式進入接單流程。",
      "織女接單後，系統開始計算交貨期限。",
      "若織女未接單或訂單無法成立，秦時線可依規則協助取消或退款。",
      "訂金、尾款、廣告費等支付紀錄均需保留完整交易紀錄。"
    ]
  },
  {
    title: "製作過程由秦時線協調追蹤",
    items: [
      "織女確認接單後，需依承諾交貨天數完成作品。",
      "秦時線後台會記錄接單時間、交貨期限與訂單狀態。",
      "若訂單即將逾期，秦時線可主動提醒與介入。",
      "買家與織女不直接溝通，避免私下交易、爭議與資訊外洩。",
      "所有溝通紀錄以客服工單形式保留。"
    ]
  },
  {
    title: "作品先送秦時線驗收，再通知尾款",
    items: [
      "織女完成作品後，應依流程寄送至秦時線指定驗收點。",
      "秦時線會依作品描述、訂單約定、基本品質與完整度進行確認。",
      "驗收通過後，秦時線通知買家支付尾款。",
      "未經驗收的作品，不應直接進入尾款支付與出貨流程。",
      "如作品與描述明顯不符，秦時線可協調修改、補件、延後尾款或啟動爭議處理。"
    ]
  },
  {
    title: "驗收通過後，買家再支付尾款",
    items: [
      "買家在秦時線驗收通過後支付尾款。",
      "尾款支付完成後，秦時線安排出貨。",
      "若尾款逾期未支付，秦時線可依訂單規則提醒、暫停出貨或啟動客服處理。",
      "尾款支付狀態必須寫入支付紀錄，避免重複入帳。"
    ]
  },
  {
    title: "秦時線統一出貨，保護雙方隱私",
    items: [
      "第一版物流流程採用「織女寄至秦時線，秦時線再寄給買家」。",
      "織女不直接取得買家完整地址。",
      "買家不取得織女真實地址與聯絡資訊。",
      "秦時線可記錄出貨狀態、物流資訊與交付結果。",
      "出貨完成後，訂單進入完成或售後階段。"
    ]
  },
  {
    title: "買家與織女資料彼此隔離",
    items: [
      "買家不得查看織女手機、微信、地址、收款資料。",
      "織女不得查看買家手機、姓名、地址。",
      "雙方不得直接聊天，所有訊息透過秦時線客服工單處理。",
      "手機號不得明文保存，需使用 phone_hash 查重與 phone_encrypted 加密保存。",
      "織女收款資料僅限財務或超級管理員查看，買家地址僅限營運或超級管理員查看。"
    ]
  },
  {
    title: "發生爭議時，由秦時線介入處理",
    items: [
      "若作品延遲、描述不符、驗收異常或交付爭議，買家或織女可提交客服工單。",
      "秦時線可根據訂單紀錄、支付紀錄、作品描述、驗收結果與客服紀錄判斷處理方式。",
      "爭議處理方式可包括補件、修改、延後尾款、取消訂單、部分退款或全額退款。",
      "爭議訂單需標記為 DISPUTED。",
      "所有處理過程應保留 audit_logs 與 order_status_logs。"
    ]
  },
  {
    title: "織女需人工審核後才能接單",
    items: [
      "織女註冊後狀態為待審核。",
      "未審核織女不得發布作品、接單或申請推廣。",
      "秦時線可審核織女作品、擅長品類、簡介與收款資料。",
      "審核不通過時，應提供原因。",
      "審核通過後，織女才可正式參與委託與交易。"
    ]
  },
  {
    title: "織女付費推廣需審核後才展示",
    items: [
      "織女可付費申請首頁三格推廣位。",
      "推廣內容需經秦時線審核，審核通過後才進入付款流程。",
      "未付款不得展示。",
      "廣告內容不得包含私下聯絡方式。",
      "推廣卡片需明確標示「織女付費推廣」，廣告費屬秦時線收入，不進入織女結算。"
    ]
  }
];

export default function GuaranteePage() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  return (
    <main className="brand-page guarantee-page">
      <section className="container page-hero">
        <span className="eyebrow">{isEn ? "Qin Guarantee" : "秦時線保障"}</span>
        <h1>{isEn ? "Qin Guarantee" : "秦時線保障"}</h1>
        <p>{isEn ? "From commission to delivery, Qin Thread uses staged payment, inspection, privacy protection, and human coordination to protect each handmade transaction." : "從委託、製作、驗收、付款到交付，秦時線以分階段流程與人工協調，守護每一次手作交易。"}</p>
      </section>

      <section className="container guarantee-summary">
        {["委託確認", "訂金尾款", "作品驗收", "隱私隔離"].map((item) => (
          <div className="summary-chip" key={item}><ShieldCheck size={18} />{item}</div>
        ))}
      </section>

      <section className="container guarantee-grid">
        {rules.map((rule, index) => {
          const Icon = icons[index] || ShieldCheck;
          return (
            <article className="card guarantee-card" key={rule.title}>
              <div className="guarantee-card-head">
                <div className="mode-illustration"><Icon size={30} /></div>
                <small>{String(index + 1).padStart(2, "0")}</small>
              </div>
              <h2>{rule.title}</h2>
              <ul>
                {rule.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          );
        })}
      </section>

      <section className="container final-cta">
        <h2>{isEn ? "Commission with a clearer, calmer process." : "讓每一次委託，都有清楚流程與溫柔照看"}</h2>
        <div className="actions">
          <Link className="btn primary" href="/works">{isEn ? "Start a Commission" : "開始委託作品"}</Link>
          <Link className="btn" href="/register/knitter">{isEn ? "Join as Knitter" : "申請成為織女"}</Link>
        </div>
      </section>
    </main>
  );
}
