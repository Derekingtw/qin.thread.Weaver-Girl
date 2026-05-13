export default function KnitterAdDetailPage() {
  return (
    <main className="container section">
      <h1>推廣申請詳情</h1>
      <article className="card announcement-card">
        <span className="tag">APPROVED_PENDING_PAYMENT</span>
        <h3 className="card-title">青禾手作・柔霧圍巾委託</h3>
        <p className="card-desc">請在付款期限內支付廣告費。重複付款會直接返回既有 PAID payment，不會重複入帳。</p>
        <button className="btn primary" type="button">支付廣告費</button>
      </article>
    </main>
  );
}
