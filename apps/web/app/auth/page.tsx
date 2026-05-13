export default function AuthPage() {
  return (
    <main className="container section">
      <h1>手機號登入／註冊</h1>
      <form className="card form">
        <input className="input" placeholder="手機號" />
        <input className="input" placeholder="驗證碼，開發環境 123456" />
        <label className="muted"><input type="checkbox" /> 我已同意使用者協議與隱私權政策</label>
        <button className="btn primary" type="button">繼續</button>
      </form>
    </main>
  );
}
