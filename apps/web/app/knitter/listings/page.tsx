export default function KnitterListingsPage() {
  return (
    <main className="container section">
      <h1>我的作品／任務</h1>
      <form className="card form">
        <input className="input" placeholder="作品標題" />
        <textarea className="input" placeholder="作品描述，不得包含手機、微信、Email 或私下聯絡方式" rows={5} />
        <input className="input" placeholder="價格（分）" />
        <input className="input" placeholder="交貨天數" />
        <button className="btn primary" type="button">提交平台審核</button>
      </form>
    </main>
  );
}
