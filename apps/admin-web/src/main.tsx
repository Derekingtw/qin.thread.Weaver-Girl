import React from "react";
import ReactDOM from "react-dom/client";
import { App, Alert, Button, Card, ConfigProvider, Descriptions, Form, Input, Layout, Menu, Modal, Select, Space, Spin, Statistic, Switch, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  AuditOutlined,
  DashboardOutlined,
  DollarOutlined,
  FileTextOutlined,
  HomeOutlined,
  LoginOutlined,
  MessageOutlined,
  NotificationOutlined,
  PictureOutlined,
  QrcodeOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TeamOutlined
} from "@ant-design/icons";
import "./styles.css";

const { Header, Sider, Content } = Layout;
const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const tokenKey = "qinshixian_admin_token";

type ApiState<T> = { loading: boolean; error?: string; data?: T };
type AnyRecord = Record<string, any>;
type UserSession = { token: string; user: { id: string; employeeRole?: string; roles?: Array<{ role: string }> } };

const menuItems = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "homepage", icon: <HomeOutlined />, label: "首頁設定" },
  { key: "media", icon: <PictureOutlined />, label: "媒體素材" },
  { key: "announcements", icon: <NotificationOutlined />, label: "活動公告" },
  { key: "platform-products", icon: <ShoppingOutlined />, label: "秦時線自營選品" },
  { key: "knitters", icon: <TeamOutlined />, label: "織女審核" },
  { key: "listings", icon: <FileTextOutlined />, label: "作品審核" },
  { key: "ads", icon: <QrcodeOutlined />, label: "織女廣告管理" },
  { key: "ad-packages", icon: <SettingOutlined />, label: "廣告方案" },
  { key: "users", icon: <TeamOutlined />, label: "買家 / 織女管理" },
  { key: "orders", icon: <ShoppingOutlined />, label: "訂單管理" },
  { key: "tickets", icon: <MessageOutlined />, label: "客服工單" },
  { key: "settlements", icon: <DollarOutlined />, label: "結算管理" },
  { key: "refunds", icon: <DollarOutlined />, label: "退款管理" },
  { key: "employee-invites", icon: <LoginOutlined />, label: "員工邀請碼" },
  { key: "cms", icon: <FileTextOutlined />, label: "頁面內容管理" },
  { key: "style", icon: <SettingOutlined />, label: "風格設定" },
  { key: "audit", icon: <AuditOutlined />, label: "操作紀錄" }
];

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(tokenKey);
  const headers: Record<string, string> = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined)
  };
  const response = await fetch(`${apiBase}${path}`, { ...options, headers });
  if (response.status === 401) {
    localStorage.removeItem(tokenKey);
    throw new Error("401：登入已過期，請重新登入。");
  }
  if (response.status === 403) throw new Error("403：沒有權限執行此操作。");
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `API 錯誤 ${response.status}`);
  }
  return response.json();
}

function useApi<T>(path: string, deps: React.DependencyList = []) {
  const [state, setState] = React.useState<ApiState<T>>({ loading: true });
  const load = React.useCallback(async () => {
    setState({ loading: true });
    try {
      setState({ loading: false, data: await api<T>(path) });
    } catch (error) {
      setState({ loading: false, error: error instanceof Error ? error.message : "未知錯誤" });
    }
  }, [path]);
  React.useEffect(() => { void load(); }, deps);
  return { ...state, reload: load };
}

function StateBlock<T>({ state, children }: { state: ApiState<T>; children: (data: T) => React.ReactNode }) {
  if (state.loading) return <Card><Spin /> 載入中...</Card>;
  if (state.error) return <Alert type="error" showIcon message={state.error} />;
  if (!state.data || (Array.isArray(state.data) && state.data.length === 0)) return <Alert type="info" showIcon message="目前沒有資料。" />;
  return <>{children(state.data)}</>;
}

function LoginPage({ onLogin }: { onLogin: (session: UserSession) => void }) {
  const [apiHealth, setApiHealth] = React.useState<ApiState<AnyRecord>>({ loading: true });
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm();

  React.useEffect(() => {
    api<AnyRecord>("/health")
      .then((data) => setApiHealth({ loading: false, data }))
      .catch((error) => setApiHealth({ loading: false, error: error instanceof Error ? error.message : "後台目前無法連線至秦時線 API，請檢查 API_BASE_URL 或 Render API service。" }));
  }, []);

  async function requestOtp() {
    const phone = form.getFieldValue("phone");
    if (!phone) return message.warning("請先輸入手機號。");
    await api("/auth/request-otp", { method: "POST", body: JSON.stringify({ phone, purpose: "LOGIN" }) });
    message.success("驗證碼已送出。開發 / MVP 預設 OTP = 123456");
  }

  async function submit(values: { phone: string; code: string }) {
    setSubmitting(true);
    try {
      const session = await api<UserSession>("/auth/login", { method: "POST", body: JSON.stringify(values) });
      if (!session.user.employeeRole) throw new Error("此帳號不是員工帳號，無法登入後台。");
      localStorage.setItem(tokenKey, session.token);
      onLogin(session);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "登入失敗");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <Card className="login-card">
        <img src="/brand/qinshixian-logo-main.png" alt="秦時線" className="login-logo" />
        <h1>秦時線管理後台</h1>
        {apiHealth.loading ? <Alert type="info" message="正在檢查 API 連線..." /> : apiHealth.error ? <Alert type="error" showIcon message="後台目前無法連線至秦時線 API，請檢查 API_BASE_URL 或 Render API service。" description={apiHealth.error} /> : <Alert type="success" showIcon message="API 連線正常" description={`API: ${apiBase}`} />}
        <Form form={form} layout="vertical" onFinish={submit} initialValues={{ code: "123456" }}>
          <Form.Item name="phone" label="員工手機號" rules={[{ required: true }]}>
            <Input placeholder="例如 13800000001" />
          </Form.Item>
          <Form.Item name="code" label="驗證碼" rules={[{ required: true }]}>
            <Input addonAfter={<Button type="link" onClick={requestOtp}>發送</Button>} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting} block>登入後台</Button>
        </Form>
        <p className="login-help">測試帳號：SUPER_ADMIN 13800000001，MARKETING 13800000006，REVIEWER 13800000002，OPS 13800000003，FINANCE 13800000004，CUSTOMER_SERVICE 13800000005。OTP = 123456。</p>
      </Card>
    </div>
  );
}

function Dashboard() {
  const state = useApi<AnyRecord>("/admin/dashboard", []);
  return (
    <StateBlock state={state}>
      {(data) => (
        <div className="stack">
          <div className="admin-grid">
            {Object.entries(data.metrics || {}).map(([key, value]) => <Card key={key}><Statistic title={metricLabel(key)} value={Number(value) || 0} /></Card>)}
          </div>
          <Card title="營運提醒">
            <Space wrap>
              <Tag color="orange">待審織女 {data.todo?.pendingKnitters ?? 0}</Tag>
              <Tag color="orange">待審作品 {data.todo?.pendingListings ?? 0}</Tag>
              <Tag color="blue">未回覆工單 {data.todo?.openTickets ?? 0}</Tag>
              <Tag color={data.health?.database === "ok" ? "green" : "red"}>DB {data.health?.database}</Tag>
              <Tag color={data.health?.redis === "ok" ? "green" : "gold"}>Redis {data.health?.redis}</Tag>
              <Tag color={data.health?.storage === "MOCK" ? "gold" : "green"}>Storage {data.health?.storage}</Tag>
            </Space>
          </Card>
        </div>
      )}
    </StateBlock>
  );
}

function HomepageSettings() {
  const { data, loading, error, reload } = useApi<AnyRecord>("/admin/homepage-settings", []);
  const media = useApi<AnyRecord[]>("/admin/media-assets?usage=HOME_HERO", []);
  const [form] = Form.useForm();
  const [saving, setSaving] = React.useState(false);
  const imageUrl = Form.useWatch("hero_image_url", form);

  React.useEffect(() => { if (data) form.setFieldsValue(data); }, [data, form]);

  async function save(values: AnyRecord) {
    setSaving(true);
    try {
      await api("/admin/homepage-settings", { method: "PATCH", body: JSON.stringify(values) });
      message.success("首頁設定已儲存，前台重新整理後會讀取新設定。");
      await reload();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  }

  async function upload(file?: File) {
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    body.append("usage", "HOME_HERO");
    try {
      const asset = await api<AnyRecord>("/admin/media/upload", { method: "POST", body });
      form.setFieldsValue({ hero_image_url: asset.url, hero_image_asset_id: asset.id });
      message.success(asset.warning || "圖片已上傳並套用到表單。");
      await media.reload();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "上傳失敗");
    }
  }

  if (loading) return <Card><Spin /> 載入首頁設定...</Card>;
  if (error) return <Alert type="error" showIcon message={error} />;

  return (
    <div className="stack">
      <Card title="首頁設定" extra={<Button onClick={() => window.open("https://qinshixian-web-prod.onrender.com/", "_blank")}>開啟前台</Button>}>
        <Form form={form} layout="vertical" onFinish={save}>
          <div className="form-grid">
            <Form.Item name="hero_image_url" label="Hero 圖片 URL"><Input /></Form.Item>
            <Form.Item name="hero_image_asset_id" label="Hero 素材 ID"><Input disabled /></Form.Item>
            <Form.Item label="上傳新圖片"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void upload(event.target.files?.[0])} /></Form.Item>
            <Form.Item name="hero_image_position" label="Desktop object-position"><Input placeholder="center" /></Form.Item>
            <Form.Item name="hero_image_mobile_position" label="Mobile object-position"><Input placeholder="center" /></Form.Item>
            <Form.Item name="show_hero_stat_card" label="顯示統計卡片" valuePropName="checked"><Switch /></Form.Item>
          </div>
          {imageUrl ? <img src={imageUrl} alt="Hero preview" className="hero-preview" /> : <Alert type="warning" message="目前沒有 Hero 圖片 URL" />}
          <h3>Hero 文案</h3>
          <div className="form-grid">
            <Form.Item name="hero_badge_zh_hant" label="小標（繁）"><Input /></Form.Item>
            <Form.Item name="hero_badge_zh_hans" label="小标（简）"><Input /></Form.Item>
            <Form.Item name="hero_badge_en" label="Badge（EN）"><Input /></Form.Item>
            <Form.Item name="hero_slogan_zh_hant" label="Slogan（繁）"><Input /></Form.Item>
            <Form.Item name="hero_slogan_zh_hans" label="Slogan（简）"><Input /></Form.Item>
            <Form.Item name="hero_slogan_en" label="Slogan（EN）"><Input /></Form.Item>
            <Form.Item name="hero_subtitle_zh_hant" label="副標（繁）"><Input.TextArea rows={2} /></Form.Item>
            <Form.Item name="hero_subtitle_zh_hans" label="副标（简）"><Input.TextArea rows={2} /></Form.Item>
            <Form.Item name="hero_subtitle_en" label="Subtitle（EN）"><Input.TextArea rows={2} /></Form.Item>
          </div>
          <h3>CTA 與信任點</h3>
          <div className="form-grid">
            <Form.Item name="primary_cta_text_zh_hant" label="主按鈕（繁）"><Input /></Form.Item>
            <Form.Item name="primary_cta_text_en" label="Primary CTA（EN）"><Input /></Form.Item>
            <Form.Item name="primary_cta_url" label="主按鈕連結"><Input /></Form.Item>
            <Form.Item name="secondary_cta_text_zh_hant" label="次按鈕（繁）"><Input /></Form.Item>
            <Form.Item name="secondary_cta_text_en" label="Secondary CTA（EN）"><Input /></Form.Item>
            <Form.Item name="secondary_cta_url" label="次按鈕連結"><Input /></Form.Item>
            <Form.Item name="trust_point_1_zh_hant" label="信任點 1"><Input /></Form.Item>
            <Form.Item name="trust_point_2_zh_hant" label="信任點 2"><Input /></Form.Item>
            <Form.Item name="trust_point_3_zh_hant" label="信任點 3"><Input /></Form.Item>
          </div>
          <h3>風格設定</h3>
          <div className="form-grid">
            <Form.Item name="default_style" label="預設風格"><Select options={[{ value: "fashion", label: "時尚風" }, { value: "cozy", label: "溫馨風" }, { value: "chinese", label: "中國風" }]} /></Form.Item>
            <Form.Item name="allow_style_switch" label="允許前台切換風格" valuePropName="checked"><Switch /></Form.Item>
            <Form.Item name="enabled_styles" label="啟用風格"><Select mode="tags" options={[{ value: "fashion" }, { value: "cozy" }, { value: "chinese" }]} /></Form.Item>
          </div>
          <Space><Button type="primary" htmlType="submit" loading={saving}>發布設定</Button><Button onClick={() => form.setFieldsValue(data)}>還原表單</Button></Space>
        </Form>
      </Card>
      <Card title="使用已上傳素材">
        <StateBlock state={media}>{(assets) => <Space wrap>{assets.map((asset) => <Button key={asset.id} onClick={() => form.setFieldsValue({ hero_image_url: asset.url, hero_image_asset_id: asset.id })}>{asset.original_name || asset.id}</Button>)}</Space>}</StateBlock>
      </Card>
      <Card title="三風格預覽">
        <div className="style-preview-grid">
          {["時尚風", "溫馨風", "中國風"].map((name) => <Card key={name} size="small"><h3>{name}</h3><p>{form.getFieldValue("hero_slogan_zh_hant") || "讓每一件手作，都被溫柔對待"}</p></Card>)}
        </div>
      </Card>
    </div>
  );
}

function MediaLibrary() {
  const state = useApi<AnyRecord[]>("/admin/media-assets", []);
  async function upload(file?: File) {
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    body.append("usage", "OTHER");
    try {
      await api("/admin/media/upload", { method: "POST", body });
      message.success("素材已上傳。");
      await state.reload();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "上傳失敗");
    }
  }
  return (
    <div className="stack">
      <Card title="媒體素材" extra={<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void upload(event.target.files?.[0])} />}>
        <ResourceTable state={state} columns={mediaColumns(state.reload)} />
      </Card>
    </div>
  );
}

function ResourceTable({ state, columns }: { state: ApiState<AnyRecord[]> & { reload: () => Promise<void> }; columns: ColumnsType<AnyRecord> }) {
  return <StateBlock state={state}>{(rows) => <Table rowKey="id" dataSource={rows} columns={columns} pagination={{ pageSize: 10 }} />}</StateBlock>;
}

function CrudResource({ title, path, columns, createFields, createBody }: { title: string; path: string; columns: ColumnsType<AnyRecord>; createFields?: React.ReactNode; createBody?: (values: AnyRecord) => AnyRecord }) {
  const state = useApi<AnyRecord[]>(path, [path]);
  const [open, setOpen] = React.useState(false);
  const [form] = Form.useForm();
  async function create(values: AnyRecord) {
    try {
      await api(path, { method: "POST", body: JSON.stringify(createBody ? createBody(values) : values) });
      message.success("已新增。");
      setOpen(false);
      form.resetFields();
      await state.reload();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "新增失敗");
    }
  }
  return (
    <Card title={title} extra={createFields ? <Button type="primary" onClick={() => setOpen(true)}>新增</Button> : undefined}>
      <ResourceTable state={state} columns={columns} />
      <Modal title={`新增${title}`} open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={create}>{createFields}</Form>
      </Modal>
    </Card>
  );
}

function ReviewResource({ title, path, approvePath, rejectPath }: { title: string; path: string; approvePath: (id: string) => string; rejectPath: (id: string) => string }) {
  const state = useApi<AnyRecord[]>(path, [path]);
  async function action(id: string, type: "approve" | "reject") {
    try {
      await api(type === "approve" ? approvePath(id) : rejectPath(id), { method: "POST", body: JSON.stringify(type === "reject" ? { reason: "後台審核未通過" } : {}) });
      message.success(type === "approve" ? "已通過" : "已拒絕");
      await state.reload();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "操作失敗");
    }
  }
  return (
    <Card title={title}>
      <ResourceTable
        state={state}
        columns={[
          { title: "名稱", render: (_, row) => row.display_name || row.title || row.ad_title_zh_hant || row.id },
          { title: "狀態", dataIndex: "application_status", render: (_, row) => <Tag>{row.application_status || row.status}</Tag> },
          { title: "建立時間", dataIndex: "created_at" },
          { title: "操作", render: (_, row) => <Space><Button onClick={() => void action(row.id, "approve")}>通過</Button><Button danger onClick={() => void action(row.id, "reject")}>拒絕</Button></Space> }
        ]}
      />
    </Card>
  );
}

function ContentPage({ selected }: { selected: string }) {
  if (selected === "dashboard") return <Dashboard />;
  if (selected === "homepage") return <HomepageSettings />;
  if (selected === "media") return <MediaLibrary />;
  if (selected === "announcements") return <CrudResource title="活動公告" path="/admin/announcements" columns={basicColumns} createFields={<><Form.Item name="title_zh_hant" label="標題" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="summary_zh_hant" label="摘要"><Input.TextArea /></Form.Item><Form.Item name="image_url" label="圖片 URL"><Input /></Form.Item><Form.Item name="status" label="狀態" initialValue="PUBLISHED"><Select options={[{ value: "DRAFT" }, { value: "PUBLISHED" }, { value: "ARCHIVED" }]} /></Form.Item></>} />; 
  if (selected === "platform-products") return <CrudResource title="秦時線自營選品" path="/admin/platform-products" columns={productColumns} createFields={<><Form.Item name="title" label="商品名稱" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="description" label="商品說明"><Input.TextArea /></Form.Item><Form.Item name="price_cents" label="價格（分）" initialValue={10000}><Input type="number" /></Form.Item><Form.Item name="stock_quantity" label="庫存" initialValue={10}><Input type="number" /></Form.Item><Form.Item name="image_url" label="圖片 URL"><Input /></Form.Item><Form.Item name="payment_mode" label="付款方式" initialValue="FULL_PAYMENT"><Select options={[{ value: "FULL_PAYMENT" }, { value: "DEPOSIT_50" }]} /></Form.Item></>} />;
  if (selected === "knitters") return <ReviewResource title="織女審核" path="/admin/knitter-applications" approvePath={(id) => `/admin/knitter-applications/${id}/approve`} rejectPath={(id) => `/admin/knitter-applications/${id}/reject`} />;
  if (selected === "listings") return <ReviewResource title="作品審核" path="/admin/listings?status=PENDING_REVIEW" approvePath={(id) => `/admin/listings/${id}/approve`} rejectPath={(id) => `/admin/listings/${id}/reject`} />;
  if (selected === "ads") return <ReviewResource title="織女廣告管理" path="/admin/ad-applications" approvePath={(id) => `/admin/ad-applications/${id}/approve`} rejectPath={(id) => `/admin/ad-applications/${id}/reject`} />;
  if (selected === "ad-packages") return <CrudResource title="廣告方案" path="/admin/ad-packages" columns={basicColumns} createFields={<><Form.Item name="name_zh_hant" label="方案名稱" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="duration_days" label="天數" initialValue={7}><Input type="number" /></Form.Item><Form.Item name="price_cents" label="價格（分）" initialValue={9900}><Input type="number" /></Form.Item></>} />;
  if (selected === "orders") return <CrudResource title="訂單管理" path="/admin/orders" columns={orderColumns} />;
  if (selected === "tickets") return <CrudResource title="客服工單" path="/admin/support-tickets" columns={ticketColumns} />;
  if (selected === "settlements") return <CrudResource title="結算管理" path="/admin/settlements" columns={moneyColumns} />;
  if (selected === "refunds") return <CrudResource title="退款管理" path="/admin/refunds" columns={moneyColumns} />;
  if (selected === "users") return <CrudResource title="買家 / 織女管理" path="/admin/users" columns={userColumns} />;
  if (selected === "employee-invites") return <CrudResource title="員工邀請碼" path="/admin/employee-invites" columns={basicColumns} createFields={<><Form.Item name="inviteCode" label="邀請碼" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="role" label="角色" initialValue="MARKETING"><Select options={["SUPER_ADMIN", "MARKETING", "REVIEWER", "OPS", "FINANCE", "CUSTOMER_SERVICE"].map((value) => ({ value }))} /></Form.Item><Form.Item name="expiresAt" label="過期時間" initialValue="2027-01-01T00:00:00.000Z"><Input /></Form.Item></>} />;
  if (selected === "audit") return <CrudResource title="操作紀錄" path="/admin/audit-logs" columns={auditColumns} />;
  if (selected === "cms") return <Alert type="info" showIcon message="CMS 頁面管理 MVP" description="關於我們、秦時線保障、使用者協議、隱私權政策已支援多語欄位；完整富文本編輯器列入 TODO。" />;
  if (selected === "style") return <Alert type="info" showIcon message="風格設定在首頁設定頁可調整" description="可設定 default_style、allow_style_switch、enabled_styles，前台即時支援三風格。" />;
  return <Dashboard />;
}

function Root() {
  const [selected, setSelected] = React.useState("dashboard");
  const [session, setSession] = React.useState<UserSession | null>(null);
  const [me, setMe] = React.useState<AnyRecord | null>(null);

  React.useEffect(() => {
    if (!localStorage.getItem(tokenKey)) return;
    api<AnyRecord>("/auth/me").then((user) => {
      if (!user?.employee_profile) throw new Error("not employee");
      setMe(user);
      setSession({ token: localStorage.getItem(tokenKey) || "", user: { id: user.id, employeeRole: user.employee_profile.role } });
    }).catch(() => localStorage.removeItem(tokenKey));
  }, []);

  if (!session) return <LoginPage onLogin={(next) => { setSession(next); void api<AnyRecord>("/auth/me").then(setMe); }} />;

  const role = me?.employee_profile?.role || session.user.employeeRole;
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#3F766F", borderRadius: 8, fontFamily: '"PingFang TC", "Microsoft JhengHei", system-ui, sans-serif' } }}>
      <App>
        <Layout className="admin-shell">
          <Sider width={260} theme="light" className="sider">
            <div className="admin-brand"><img src="/brand/qinshixian-logo-main.png" alt="秦時線" /></div>
            <Menu mode="inline" selectedKeys={[selected]} items={menuItems} onClick={(event) => setSelected(event.key)} />
          </Sider>
          <Layout>
            <Header className="header">
              <Space>
                <Tag color="green">API: {apiBase}</Tag>
                <Tag>{role}</Tag>
                <Button onClick={() => window.open("https://qinshixian-web-prod.onrender.com/", "_blank")}>前台</Button>
                <Button onClick={() => { localStorage.removeItem(tokenKey); setSession(null); }}>登出</Button>
              </Space>
            </Header>
            <Content className="content"><ContentPage selected={selected} /></Content>
          </Layout>
        </Layout>
      </App>
    </ConfigProvider>
  );
}

const basicColumns: ColumnsType<AnyRecord> = [
  { title: "名稱", render: (_, row) => row.title_zh_hant || row.name_zh_hant || row.title || row.invite_code_hash || row.action || row.id },
  { title: "狀態", dataIndex: "status", render: (value) => value ? <Tag>{String(value)}</Tag> : "-" },
  { title: "建立時間", dataIndex: "created_at" }
];
const productColumns: ColumnsType<AnyRecord> = [...basicColumns, { title: "價格", dataIndex: "price_cents" }, { title: "庫存", dataIndex: "stock_quantity" }];
const orderColumns: ColumnsType<AnyRecord> = [{ title: "訂單號", dataIndex: "order_no" }, { title: "狀態", dataIndex: "status", render: (v) => <Tag>{v}</Tag> }, { title: "金額", dataIndex: "total_price_cents" }, { title: "建立時間", dataIndex: "created_at" }];
const ticketColumns: ColumnsType<AnyRecord> = [{ title: "類型", dataIndex: "ticket_type" }, { title: "狀態", dataIndex: "status", render: (v) => <Tag>{v}</Tag> }, { title: "訊息數", render: (_, row) => row.messages?.length || 0 }, { title: "建立時間", dataIndex: "created_at" }];
const moneyColumns: ColumnsType<AnyRecord> = [{ title: "ID", dataIndex: "id" }, { title: "狀態", dataIndex: "status", render: (v) => <Tag>{v}</Tag> }, { title: "金額", render: (_, row) => row.amount_cents || row.payout_amount_cents || row.gross_amount_cents }, { title: "建立時間", dataIndex: "created_at" }];
const userColumns: ColumnsType<AnyRecord> = [{ title: "Public Code", dataIndex: "public_code" }, { title: "角色", render: (_, row) => row.roles?.map((r: AnyRecord) => <Tag key={r.role}>{r.role}</Tag>) }, { title: "員工角色", render: (_, row) => row.employee_profile?.role || "-" }, { title: "建立時間", dataIndex: "created_at" }];
const auditColumns: ColumnsType<AnyRecord> = [{ title: "Action", dataIndex: "action" }, { title: "Entity", dataIndex: "entity_type" }, { title: "Entity ID", dataIndex: "entity_id" }, { title: "時間", dataIndex: "created_at" }];

function mediaColumns(reload: () => Promise<void>): ColumnsType<AnyRecord> {
  return [
    { title: "預覽", render: (_, row) => <img src={row.url} alt={row.original_name || row.id} className="asset-thumb" /> },
    { title: "名稱", render: (_, row) => row.original_name || row.id },
    { title: "用途", dataIndex: "usage", render: (v) => <Tag>{v}</Tag> },
    { title: "尺寸", render: (_, row) => row.width ? `${row.width}x${row.height}` : "-" },
    { title: "Provider", dataIndex: "storage_provider", render: (v) => <Tag color={v === "MOCK" ? "gold" : "green"}>{v}</Tag> },
    { title: "操作", render: (_, row) => <Space><Button onClick={() => navigator.clipboard.writeText(row.url)}>複製 URL</Button><Button danger onClick={async () => { await api(`/admin/media-assets/${row.id}`, { method: "DELETE" }); await reload(); }}>刪除</Button></Space> }
  ];
}

function metricLabel(key: string) {
  return ({ users: "使用者", pendingKnitters: "待審織女", pendingListings: "待審作品", orders: "訂單", openTickets: "未回覆工單", paidAmountCents: "已付金額", mediaAssets: "素材" } as Record<string, string>)[key] || key;
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
