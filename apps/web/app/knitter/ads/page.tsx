export default function KnitterAdsPage() {
  return (
    <main className="container section">
      <h1>我的推廣申請</h1>
      <div className="grid-3">
        {["待審核", "待付款", "推廣中"].map((status) => (
          <article className="card announcement-card" key={status}>
            <span className="tag">{status}</span>
            <h3 className="card-title">首頁三格推廣位</h3>
            <p className="card-desc">推廣位為付費曝光，所有內容仍需平台審核。不得填寫任何私下聯絡方式。</p>
          </article>
        ))}
      </div>
      <a className="btn primary" href="/knitter/ads/new" style={{ marginTop: 20 }}>提交推廣申請</a>
    </main>
  );
}
