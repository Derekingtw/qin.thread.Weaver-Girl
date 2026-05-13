export default function KnitterDashboardPage() {
  return (
    <main className="container section">
      <h1>織女工作台</h1>
      <div className="grid">
        <div className="card"><span className="tag">待接單</span><h2>2</h2><p className="muted">需確認是否接單</p></div>
        <div className="card"><span className="tag">製作中</span><h2>3</h2><p className="muted">平台會追蹤交貨期限</p></div>
        <div className="card"><span className="tag">待結算</span><h2>¥950.00</h2><p className="muted">完成訂單後進入結算</p></div>
      </div>
    </main>
  );
}
