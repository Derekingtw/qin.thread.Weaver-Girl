export default function NewKnitterAdPage() {
  return (
    <main className="container section">
      <h1>提交推廣申請</h1>
      <form className="card form" style={{ padding: 22 }}>
        <input className="input" placeholder="選擇自己的 LIVE 作品" />
        <input className="input" placeholder="推廣標題" />
        <input className="input" placeholder="推廣副標" />
        <input className="input" placeholder="推廣圖片 URL" />
        <p className="section-subtitle">付款後才會依排程上架；審核未通過不會產生廣告費。不得填寫手機、微信、Email 或其他私下聯絡方式。</p>
        <button className="btn primary" type="button">提交審核</button>
      </form>
    </main>
  );
}
