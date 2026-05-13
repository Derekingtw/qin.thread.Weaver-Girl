const steps = ["訂金", "織女接單", "製作中", "平台驗收", "尾款", "出貨", "完成"];

export default function BuyerOrdersPage() {
  return (
    <main className="container section">
      <h1>我的訂單</h1>
      <article className="card">
        <span className="tag">IN_PROGRESS</span>
        <h2>雲朵感手織圍巾</h2>
        <p>總價 ¥680.00 · 訂金 ¥340.00 · 尾款 ¥340.00</p>
        <div className="timeline">
          {steps.map((step) => <div key={step}>{step}</div>)}
        </div>
        <div className="actions" style={{ marginTop: 16 }}>
          <a className="btn primary" href="/buyer/orders">支付尾款</a>
          <a className="btn" href="/buyer/support-tickets">平台客服</a>
        </div>
      </article>
    </main>
  );
}
