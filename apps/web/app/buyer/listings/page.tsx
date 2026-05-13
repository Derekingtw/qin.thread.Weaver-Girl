const items = [
  { title: "雲朵感手織圍巾", price: "¥680.00", deposit: "¥340.00", days: 14, mode: "COMMISSION_5" },
  { title: "平台款針織托特包", price: "¥880.00", deposit: "¥440.00", days: 10, mode: "PLATFORM_BUYOUT_SERVICE" },
  { title: "溫柔配色毛線帽", price: "¥360.00", deposit: "¥180.00", days: 7, mode: "COMMISSION_5" }
];

export default function BuyerListingsPage() {
  return (
    <main className="container section">
      <h1>作品列表</h1>
      <p className="muted">搜尋與篩選會接入 API；MVP 先展示作品卡片資訊層級。</p>
      <div className="grid">
        {items.map((item) => (
          <article className="card" key={item.title}>
            <span className="tag">{item.mode}</span>
            <h2>{item.title}</h2>
            <p className="muted">交貨天數：{item.days} 天</p>
            <p>總價 <strong>{item.price}</strong> · 訂金 {item.deposit}</p>
            <a className="btn primary" href="/buyer/orders">下單確認</a>
          </article>
        ))}
      </div>
    </main>
  );
}
