export default function KnitterOrdersPage() {
  return (
    <main className="container section">
      <h1>我的訂單</h1>
      <article className="card">
        <span className="tag">AWAITING_KNITTER_ACCEPTANCE</span>
        <h2>雲朵感手織圍巾</h2>
        <p className="muted">買家資料已由平台隔離，請只按平台需求製作。</p>
        <div className="actions">
          <button className="btn primary">確認接單</button>
          <button className="btn">標記已寄到平台</button>
        </div>
      </article>
    </main>
  );
}
