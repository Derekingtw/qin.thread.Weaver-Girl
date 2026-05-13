import Link from "next/link";

export default function KnitterPendingPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel center">
        <h1>你的入駐申請已提交</h1>
        <p className="section-subtitle">秦時線團隊將人工審核你的資料。審核通過後，你即可發布作品與接單。</p>
        <Link className="btn primary" href="/">回到首頁</Link>
      </section>
    </main>
  );
}
