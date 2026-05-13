# 支付設計

## MockPaymentProvider

第一版 `pay-deposit` 與 `pay-balance` 建立 payments record，provider=MOCK，idempotency_key=`orderId:paymentType`。MVP 預設自動標記 PAID 並推進訂單狀態。

## 訂金流程

1. Buyer 建立訂單，狀態 DEPOSIT_PENDING。
2. POST `/buyer/orders/:id/pay-deposit`。
3. 建立或復用 payment。
4. Mock provider 支付成功。
5. COMMISSION_5 → AWAITING_KNITTER_ACCEPTANCE。
6. PLATFORM_BUYOUT_SERVICE → IN_PROGRESS。
7. PLATFORM_OWNED_INVENTORY → BALANCE_PENDING。

## 尾款流程

1. 平台驗收通過後訂單進 BALANCE_PENDING。
2. Buyer 呼叫 pay-balance。
3. 支付成功後訂單進 BALANCE_PAID。
4. OPS/SUPER_ADMIN 才能標記平台出貨。

## Notify Idempotency

支付 notify 以 `idempotency_key` 查找 payment。若 payment 已 PAID，直接返回，不重複推進訂單、不重複增加 tracking counter、不重複入帳。

## 正式支付預留

- WeChat JSAPI：用於公众号/H5 內微信環境。
- WeChat H5：用於瀏覽器 H5。
- WeChat Native：用於 PC 掃碼。
- WeChat App：用於未來 App。
- Alipay WAP / Native / App：對應 H5、PC、App。

所有商戶號、私鑰、API key 只放後端 env，前端不得保存。
