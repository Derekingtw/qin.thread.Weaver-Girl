# 多端資料共用與轉移策略

## 共用原則

H5、小程序、App、Admin Web 都只能透過 apps/api 存取資料，共用同一個 MySQL 主庫。前端不得直連資料庫。

## User ID

users.id 使用 UUID。不得使用手機號、微信 openid、unionid 作為 user_id。

## H5 升級小程序

小程序登入後取得 openid/unionid，寫入 wechat_bindings。若使用者已用手機註冊，透過 phone_hash 綁定既有 users.id。

## H5 升級 App

App 透過手機 OTP 或第三方 OAuth 登入，device token 寫入 user_devices，通知寫入 app_notifications。訂單需帶 order_channel=APP。

## 既有使用者綁定

手機號標準化後計算 phone_hash。若 phone_hash 已存在，將微信 openid 或 App device 綁到既有 user_id。

## 備份流程

正式 migration 前先備份 MySQL，匯出 migration SQL，於 staging 執行並驗證 seed/核心流程，再進 production。

## Rollback

所有 schema 變更透過 Prisma migration。破壞性變更需使用 expand/contract：先新增欄位與雙寫，再回填，最後移除舊欄位。

## Payment Idempotency

payments.idempotency_key 必須唯一。支付 notify 重複呼叫不可重複入帳，不可重複建立 settlement 或重複推進訂單狀態。
