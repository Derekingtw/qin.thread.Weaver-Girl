# 私域經營

## 渠道

MARKETING 可建立 lead_sources，例如微信群、公众号、企微、小紅書、抖音、視頻號、朋友圈、人工與其他來源。

## 活動

campaigns 管理活動生命週期：DRAFT、ACTIVE、PAUSED、ENDED。一個活動可掛多個 tracking_links。

## 短鏈與 QR Code

tracking_links 使用 `/r/:code`。流程：

1. 使用者訪問短鏈。
2. API 建立 tracking_events.PAGE_VIEW。
3. tracking_links.click_count + 1。
4. 寫入 cookie/localStorage tracking context。
5. redirect 到 target_url。

QR Code 第一版由前端使用短鏈 URL 生成。

## 轉化漏斗

追蹤：點擊 → 註冊 → 下單 → 訂金支付 → 尾款支付。對應 counters：click_count、register_count、order_count、deposit_paid_count、balance_paid_count。

## 客服分配

service_assignments 將買家或織女分配給 CUSTOMER_SERVICE。後台顯示負責人、待回覆 ticket 與近期聯繫紀錄。

## 微信預留

wechat_bindings 保存 app_type、openid、unionid、nickname、avatar_url、subscribe_status。MVP 不做真實 OAuth，後續接入 OfficialAccountOAuthProvider 與 MiniProgramOAuthProvider。
