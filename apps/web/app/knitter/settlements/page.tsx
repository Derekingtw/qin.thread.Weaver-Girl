export default function KnitterSettlementsPage() {
  return (
    <main className="container section">
      <h1>結算列表</h1>
      <div className="grid">
        <div className="card"><span className="tag">PENDING</span><h2>¥950.00</h2><p className="muted">傭金訂單結算</p></div>
        <div className="card"><span className="tag">APPROVED</span><h2>¥300.00</h2><p className="muted">買斷手工費</p></div>
      </div>
    </main>
  );
}
