"use client";

import Link from "next/link";
import { Gift, Scissors, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";

type Mode = "login" | "register" | "buyer" | "knitter" | "employee";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const phoneSchema = z.string().min(6, "請輸入手機號").max(32);
const otpSchema = z.string().regex(/^\d{6}$/, "請輸入 6 位驗證碼");

export function AuthModal({ mode = "register" }: { mode?: Mode }) {
  const [active, setActive] = useState<Mode>(mode === "login" ? "login" : mode === "employee" ? "employee" : mode === "knitter" ? "knitter" : mode === "buyer" ? "buyer" : "register");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<Record<string, string | boolean>>({
    role: "buyer",
    phone: "",
    code: "",
    nickname: "",
    displayName: "",
    skills: "",
    workUrl: "",
    intro: "",
    payoutAccount: "",
    inviteCode: "",
    name: "",
    agreedTerms: false,
    agreedPrivacy: false
  });

  const purpose = active === "login" ? "LOGIN" : "REGISTER";
  const title = useMemo(() => {
    if (active === "login") return "登入秦時線";
    if (active === "buyer") return "開始你的手作委託";
    if (active === "knitter") return "成為秦時線織女";
    if (active === "employee") return "員工邀請碼註冊";
    return "選擇註冊身份";
  }, [active]);

  const update = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  async function requestOtp() {
    setMessage("");
    const parsed = phoneSchema.safeParse(String(form.phone));
    if (!parsed.success) return setMessage(parsed.error.issues[0].message);
    const response = await fetch(`${apiBase}/auth/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: form.phone, purpose })
    });
    const payload = await response.json().catch(() => ({}));
    setMessage(response.ok ? `驗證碼已發送。開發環境 mock OTP = ${payload.mockCode ?? "123456"}` : payload.message ?? "發送失敗");
  }

  async function submit() {
    setMessage("");
    const base = z.object({ phone: phoneSchema, code: otpSchema });
    const parsed = base.safeParse({ phone: form.phone, code: form.code });
    if (!parsed.success) return setMessage(parsed.error.issues[0].message);

    const endpoint =
      active === "login" ? "/auth/login" :
      active === "buyer" ? "/auth/register-buyer" :
      active === "knitter" ? "/auth/register-knitter" :
      "/auth/employee-register-with-invite";
    const body =
      active === "knitter"
        ? {
            phone: form.phone,
            code: form.code,
            agreedTerms: form.agreedTerms,
            agreedPrivacy: form.agreedPrivacy,
            displayName: form.displayName,
            skills: String(form.skills).split(",").map((item) => item.trim()).filter(Boolean),
            intro: form.intro,
            workUrls: form.workUrl ? [form.workUrl] : [],
            payoutAccount: form.payoutAccount
          }
        : active === "buyer"
          ? { phone: form.phone, code: form.code, agreedTerms: form.agreedTerms, agreedPrivacy: form.agreedPrivacy, nickname: form.nickname }
          : active === "employee"
            ? { phone: form.phone, code: form.code, inviteCode: form.inviteCode, name: form.name }
            : { phone: form.phone, code: form.code };

    const response = await fetch(`${apiBase}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return setMessage(payload.message ?? "操作失敗");
    if (payload.token) window.localStorage.setItem("qinshixian_token", payload.token);
    if (active === "knitter") window.location.href = "/register/knitter/pending";
    else window.location.href = "/";
  }

  return (
    <section className="auth-panel">
      <div className="auth-tabs">
        <button type="button" className={active === "login" ? "active" : ""} onClick={() => setActive("login")}>登入</button>
        <button type="button" className={active !== "login" && active !== "employee" ? "active" : ""} onClick={() => setActive("register")}>註冊</button>
      </div>
      <h1>{title}</h1>
      {active === "register" ? (
        <div className="role-grid">
          <button type="button" className="role-card" onClick={() => setActive("buyer")}>
            <Gift size={30} />
            <strong>我是買家</strong>
            <span>委託、購物、準備禮物</span>
          </button>
          <button type="button" className="role-card" onClick={() => setActive("knitter")}>
            <Scissors size={30} />
            <strong>我是織女</strong>
            <span>提交作品，通過審核後接單</span>
          </button>
        </div>
      ) : (
        <div className="auth-form">
          <p className="section-subtitle">
            {active === "buyer" ? "支付訂金、平台協調、品質驗收，讓每一次委託都安心。" : null}
            {active === "knitter" ? "提交作品與資料，通過審核後即可發布任務、接單與申請曝光。" : null}
            {active === "login" ? "使用手機驗證碼登入。開發環境 mock OTP = 123456。" : null}
          </p>
          <label>手機號<input className="input" value={String(form.phone)} onChange={(event) => update("phone", event.target.value)} /></label>
          <div className="otp-row">
            <label>驗證碼<input className="input" value={String(form.code)} onChange={(event) => update("code", event.target.value)} /></label>
            <button type="button" className="btn" onClick={requestOtp}><Send size={16} />發送驗證碼</button>
          </div>
          {active === "buyer" ? <label>暱稱<input className="input" value={String(form.nickname)} onChange={(event) => update("nickname", event.target.value)} /></label> : null}
          {active === "knitter" ? (
            <>
              <div className="stepper"><span>1 手機驗證</span><span>2 基本資料</span><span>3 作品與擅長</span><span>4 收款與協議</span><span>5 提交成功</span></div>
              <label>display_name<input className="input" value={String(form.displayName)} onChange={(event) => update("displayName", event.target.value)} /></label>
              <label>擅長品類<input className="input" placeholder="毛衣, 圍巾, 禮物訂製" value={String(form.skills)} onChange={(event) => update("skills", event.target.value)} /></label>
              <label>作品 URL<input className="input" value={String(form.workUrl)} onChange={(event) => update("workUrl", event.target.value)} /></label>
              <label>簡介<textarea className="input textarea" value={String(form.intro)} onChange={(event) => update("intro", event.target.value)} /></label>
              <label>收款資料<input className="input" value={String(form.payoutAccount)} onChange={(event) => update("payoutAccount", event.target.value)} /></label>
            </>
          ) : null}
          {active === "employee" ? (
            <>
              <label>邀請碼<input className="input" value={String(form.inviteCode)} onChange={(event) => update("inviteCode", event.target.value)} /></label>
              <label>姓名<input className="input" value={String(form.name)} onChange={(event) => update("name", event.target.value)} /></label>
            </>
          ) : null}
          {active === "buyer" || active === "knitter" ? (
            <div className="consent-list">
              <label><input type="checkbox" checked={Boolean(form.agreedTerms)} onChange={(event) => update("agreedTerms", event.target.checked)} /> 我同意使用者協議</label>
              <label><input type="checkbox" checked={Boolean(form.agreedPrivacy)} onChange={(event) => update("agreedPrivacy", event.target.checked)} /> 我同意隱私權政策</label>
            </div>
          ) : null}
          {message ? <p className="form-message">{message}</p> : null}
          <button className="btn primary full" type="button" onClick={submit}>{active === "login" ? "登入" : "提交"}</button>
          {active === "login" ? <p className="section-subtitle">還沒有帳號？<Link href="/register">立即註冊</Link></p> : null}
        </div>
      )}
    </section>
  );
}
