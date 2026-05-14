# 秦時線後台操作指南

後台網址：

```text
https://qinshixian-admin-web-prod.onrender.com/
```

API：

```text
https://qinshixian-api-prod.onrender.com
```

## 登入

後台使用員工手機號與 OTP 登入。MVP 測試 OTP：

```text
123456
```

Seed 員工帳號：

- SUPER_ADMIN: `13800000001`
- MARKETING: `13800000006`
- REVIEWER: `13800000002`
- OPS: `13800000003`
- FINANCE: `13800000004`
- CUSTOMER_SERVICE: `13800000005`

登入頁會先檢查 `/health`。若看到「後台目前無法連線至秦時線 API」，請檢查 `VITE_API_BASE_URL` 是否為：

```text
https://qinshixian-api-prod.onrender.com
```

## 角色權限

- SUPER_ADMIN：全部功能。
- MARKETING：首頁設定、媒體素材、活動公告、廣告管理、風格設定、CMS。
- REVIEWER：織女審核、作品審核、廣告內容審核。
- OPS：訂單、自營商品、出貨、驗收。
- FINANCE：支付、退款、結算、廣告費收入。
- CUSTOMER_SERVICE：客服工單、買家 / 織女基礎資料；不可修改首頁設定，不可查看敏感收款資料。

無權限時後台會顯示 403，不應整頁崩潰。

## 更換首頁 Hero 圖

1. 登入後台。
2. 進入「首頁設定」。
3. 在 Hero 圖片區選擇：
   - 上傳新圖片。
   - 從媒體素材選擇。
   - 直接輸入圖片 URL。
4. 填寫圖片 alt 文字。
5. 按「發布設定」。
6. 前台重新整理後會透過 `GET /web/home` 讀取新的 `hero_image_url`。

建議圖片尺寸：

- Desktop: `1600x900` 或 `1920x1080`
- 格式：JPG、PNG、WEBP
- 預設大小限制：`MEDIA_MAX_SIZE_MB=5`

## Object Storage 未設定

若 `OBJECT_STORAGE_PROVIDER=mock`，上傳 API 會回傳 warning。這是 MVP fallback，不依賴 Render 本機 filesystem，但不建議作為正式大量圖片存放方案。

正式上線建議使用：

- Cloudflare R2
- S3-compatible storage
- Tencent COS
- Aliyun OSS

設定後更新 Render env group，並確認 `R2_PUBLIC_BASE_URL` 或對應 provider public base URL。

## 新增公告

1. 進入「活動公告」。
2. 按「新增」。
3. 填標題、摘要、圖片 URL、狀態。
4. 狀態設為 `PUBLISHED` 後，前台活動公告區會顯示。

## 新增秦時線自營選品

1. 進入「秦時線自營選品」。
2. 按「新增」。
3. 填商品名稱、說明、價格、庫存、圖片 URL、付款方式。
4. 狀態預設 `LIVE`，前台自營選品區會讀取。

## 審核織女

1. 進入「織女審核」。
2. 查看待審織女資料。
3. 按「通過」或「拒絕」。
4. 通過後織女才可發布作品與申請推廣。

## 審核廣告

1. 進入「織女廣告管理」。
2. 查看廣告申請。
3. 按「通過」或「拒絕」。
4. 指定廣告位與檔期時，API 會檢查檔期衝突。
5. 廣告費屬秦時線收入，不進入織女結算。

## API Health

後台 Dashboard 顯示：

- API health
- DB health
- Redis health
- Storage provider

也可以直接打：

```text
https://qinshixian-api-prod.onrender.com/health
```
