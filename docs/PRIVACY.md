# 隱私與安全

## 手機號

手機號不得明文入庫。使用 `phone_hash` 查重，`phone_encrypted` 保存加密值。開發環境使用 mock base64，正式環境需使用 KMS/AEAD。

## 地址

買家地址保存在 `buyer_address_encrypted` 或 `default_address_encrypted`。織女 API 不返回買家地址；只有 OPS 與 SUPER_ADMIN 可在後台查看完整地址。

## 收款資料

織女收款資料保存在 `payout_account_encrypted`。只有 FINANCE 與 SUPER_ADMIN 可查看。

## 雙方隔離

買家與織女不能直接聊天，不互相暴露手機、微信、地址、收款資料。客服只能透過 BUYER_PLATFORM / KNITTER_PLATFORM ticket。

## Consent

註冊時必須勾選使用者協議與隱私權政策，並寫入 consent_logs，包含 policy_type、policy_version、agreed_at、ip、user_agent、phone_hash 或 user_id。

## 聯絡方式阻擋

contactInfoDetector 阻擋中國大陸手機、台灣手機、Email、微信、LINE、Telegram、WhatsApp、QQ 與明顯私下聯絡提示語。
