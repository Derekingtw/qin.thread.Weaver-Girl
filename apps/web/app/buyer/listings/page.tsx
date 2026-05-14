import { cooperationLabel } from "../../../lib/cooperationDisplay";

const items = [
  { title: "雲朵感手織圍巾", price: "¥680.00", deposit: "¥340.00", days: 14, mode: "COMMISSION_5" },
  { title: "秦時線買斷針織托特包", price: "¥880.00", deposit: "¥440.00", days: 10, mode: "PLATFORM_BUYOUT_SERVICE" },
  { title: "溫柔配色毛線帽", price: "¥360.00", deposit: "¥180.00", days: 7, mode: "COMMISSION_5" }
];

export default function BuyerListingsPage() {
  return (
    <main className="container section">
      <h1>買家作品列表</h1>
      <p className="section-subtitle">MVP 頁面先展示可委託作品，後續會串接 API 與篩選條件。</p>
      <div className="grid-3">
        {items.map((item) => (
          <article className="card about-feature" key={item.title}>
            <span className="tag">{cooperationLabel(item.mode, "zh-Hant")}</span>
            <h2>{item.title}</h2>
            <p className="muted">交付天數：{item.days} 天</p>
            <p>價格 <strong>{item.price}</strong>，訂金 {item.deposit}</p>
            <a className="btn primary" href="/buyer/orders">建立訂單</a>
          </article>
        ))}
      </div>
    </main>
  );
}
