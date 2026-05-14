import React from "react";
import ReactDOM from "react-dom/client";
import { App, Button, Card, ConfigProvider, Form, Input, Layout, Menu, Select, Space, Statistic, Switch, Table, Tag } from "antd";
import {
  AuditOutlined,
  DashboardOutlined,
  DollarOutlined,
  FileTextOutlined,
  HomeOutlined,
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
const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const menuItems = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "homepage", icon: <HomeOutlined />, label: "首頁設定" },
  { key: "cms", icon: <FileTextOutlined />, label: "頁面內容管理" },
  { key: "style", icon: <SettingOutlined />, label: "風格管理" },
  { key: "announcements", icon: <NotificationOutlined />, label: "活動公告" },
  { key: "platform-products", icon: <ShoppingOutlined />, label: "秦時線自營選品" },
  { key: "ads", icon: <QrcodeOutlined />, label: "織女廣告管理" },
  { key: "media", icon: <PictureOutlined />, label: "媒體素材" },
  { key: "knitters", icon: <TeamOutlined />, label: "織女審核" },
  { key: "orders", icon: <ShoppingOutlined />, label: "訂單管理" },
  { key: "settlements", icon: <DollarOutlined />, label: "結算管理" },
  { key: "tickets", icon: <MessageOutlined />, label: "客服工單" },
  { key: "audit", icon: <AuditOutlined />, label: "Audit Logs" }
];

function authHeaders() {
  return { "Content-Type": "application/json", "x-user-id": localStorage.getItem("qinshixian_admin_user_id") ?? "" };
}

function Dashboard() {
  const stats = [
    ["註冊使用者", 24],
    ["待審核織女", 5],
    ["LIVE 作品", 18],
    ["秦時線自營選品", 4],
    ["廣告費收入", "¥299"],
    ["待處理工單", 3]
  ];
  return <div className="admin-grid">{stats.map(([label, value]) => <Card key={label}><Statistic title={label} value={value} /></Card>)}</div>;
}

function HomepageSettings() {
  const [form] = Form.useForm();
  const imageUrl = Form.useWatch("hero_image_url", form) || "/brand/hero-qinshixian-yarn.png";
  const slogan = Form.useWatch("hero_slogan_zh_hant", form) || "讓每一件手作，都被溫柔對待";
  const showStat = Form.useWatch("show_hero_stat_card", form) ?? false;

  async function submit(values: Record<string, unknown>) {
    await fetch(`${apiBase}/admin/homepage-settings`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(values)
    }).catch(() => undefined);
  }

  return (
    <div className="stack">
      <Card title="首頁 Hero 與風格設定">
        <Form
          form={form}
          layout="vertical"
          className="wide-form"
          initialValues={{
            hero_badge_zh_hant: "平台交易・安心委託・溫柔陪伴",
            hero_badge_en: "Secure commissions, crafted with care",
            hero_slogan_zh_hant: "讓每一件手作，都被溫柔對待",
            hero_slogan_en: "Every handmade piece deserves to be treated with warmth.",
            hero_subtitle_zh_hant: "我們串起想像與雙手的溫度，從委託到交付，讓美好在信任中誕生。",
            hero_subtitle_en: "From commission to delivery, Qin Thread connects imagination, hands, and trust.",
            primary_cta_text_zh_hant: "開始委託",
            primary_cta_text_en: "Start a Commission",
            primary_cta_url: "/works",
            secondary_cta_text_zh_hant: "探索作品",
            secondary_cta_text_en: "Explore Works",
            secondary_cta_url: "/works",
            hero_image_url: "/brand/hero-qinshixian-yarn.png",
            hero_image_alt_zh_hant: "秦時線毛線與編織工具形象圖",
            hero_image_alt_en: "Qin Thread yarn and knitting tools",
            show_hero_stat_card: false,
            default_style: "cozy",
            allow_style_switch: true,
            enabled_styles: ["fashion", "cozy", "chinese"],
            trust_point_1_zh_hant: "安心交易",
            trust_point_2_zh_hant: "專業協調",
            trust_point_3_zh_hant: "品質驗收"
          }}
          onFinish={submit}
        >
          <div className="form-grid">
            <Form.Item label="Hero 小標籤（繁）" name="hero_badge_zh_hant"><Input /></Form.Item>
            <Form.Item label="Hero 小標籤（EN）" name="hero_badge_en"><Input /></Form.Item>
            <Form.Item label="主 Slogan（繁）" name="hero_slogan_zh_hant"><Input /></Form.Item>
            <Form.Item label="主 Slogan（EN）" name="hero_slogan_en"><Input /></Form.Item>
            <Form.Item label="副標題（繁）" name="hero_subtitle_zh_hant"><Input.TextArea rows={3} /></Form.Item>
            <Form.Item label="副標題（EN）" name="hero_subtitle_en"><Input.TextArea rows={3} /></Form.Item>
            <Form.Item label="主按鈕文字（繁）" name="primary_cta_text_zh_hant"><Input /></Form.Item>
            <Form.Item label="主按鈕文字（EN）" name="primary_cta_text_en"><Input /></Form.Item>
            <Form.Item label="主按鈕 URL" name="primary_cta_url"><Input /></Form.Item>
            <Form.Item label="次按鈕文字（繁）" name="secondary_cta_text_zh_hant"><Input /></Form.Item>
            <Form.Item label="次按鈕文字（EN）" name="secondary_cta_text_en"><Input /></Form.Item>
            <Form.Item label="次按鈕 URL" name="secondary_cta_url"><Input /></Form.Item>
            <Form.Item label="Hero 圖片 URL" name="hero_image_url"><Input /></Form.Item>
            <Form.Item label="Hero 圖片 alt（繁）" name="hero_image_alt_zh_hant"><Input /></Form.Item>
            <Form.Item label="Hero 圖片 alt（EN）" name="hero_image_alt_en"><Input /></Form.Item>
            <Form.Item label="是否顯示統計卡片" name="show_hero_stat_card" valuePropName="checked"><Switch /></Form.Item>
            <Form.Item label="預設風格" name="default_style"><Select options={["fashion", "cozy", "chinese"].map((value) => ({ value }))} /></Form.Item>
            <Form.Item label="允許使用者切換風格" name="allow_style_switch" valuePropName="checked"><Switch /></Form.Item>
            <Form.Item label="啟用風格列表" name="enabled_styles"><Select mode="multiple" options={["fashion", "cozy", "chinese"].map((value) => ({ value }))} /></Form.Item>
          </div>
          <Button type="primary" htmlType="submit">儲存首頁設定</Button>
        </Form>
      </Card>
      <Card title="前端預覽">
        <div className="preview-card">
          <div>
            <Tag color="green">秦時線 Hero</Tag>
            <h2>{slogan}</h2>
            <p>統計卡片：{showStat ? "顯示" : "隱藏"}</p>
          </div>
          <img src={imageUrl} alt="Hero preview" />
        </div>
      </Card>
    </div>
  );
}

function CmsPages() {
  return (
    <Card title="頁面內容管理">
      <Form layout="vertical" className="wide-form">
        <Form.Item label="頁面"><Select defaultValue="about" options={[
          { value: "about", label: "關於我們" },
          { value: "guarantee", label: "秦時線保障" },
          { value: "terms", label: "使用者協議" },
          { value: "privacy", label: "隱私權政策" }
        ]} /></Form.Item>
        <div className="form-grid">
          <Form.Item label="標題（繁）"><Input defaultValue="關於秦時線" /></Form.Item>
          <Form.Item label="Title (EN)"><Input defaultValue="About Qin Thread" /></Form.Item>
          <Form.Item label="內容（繁）"><Input.TextArea rows={5} defaultValue="秦時線相信，手作不只是商品，而是一段時間、一份心意與一雙手的溫度。" /></Form.Item>
          <Form.Item label="Content (EN)"><Input.TextArea rows={5} defaultValue="Qin Thread believes handmade work carries time, care, and trust." /></Form.Item>
        </div>
        <Button type="primary">儲存頁面內容</Button>
      </Form>
    </Card>
  );
}

function StyleManagement() {
  const cards = [
    ["fashion", "時尚風", "高級、克制、精品雜誌感，適合高端選品與禮盒系列。", "/brand/fashion-theme-reference.png"],
    ["cozy", "溫馨風", "柔和、親切、手作溫度，是秦時線預設品牌風格。", "/brand/cozy-theme-reference.png"],
    ["chinese", "中國風", "雅致、國風、書卷感，適合節氣活動與秦時線文化系列。", "/brand/chinese-theme-reference.png"]
  ];
  return (
    <div className="stack">
      <Card title="風格管理">
        <Form layout="vertical" className="wide-form">
          <div className="form-grid">
            <Form.Item label="預設風格"><Select defaultValue="cozy" options={cards.map(([value, label]) => ({ value, label }))} /></Form.Item>
            <Form.Item label="允許使用者切換"><Switch defaultChecked /></Form.Item>
            <Form.Item label="啟用風格"><Select mode="multiple" defaultValue={["fashion", "cozy", "chinese"]} options={cards.map(([value, label]) => ({ value, label }))} /></Form.Item>
          </div>
          <Button type="primary">儲存風格設定</Button>
        </Form>
      </Card>
      <div className="theme-preview-grid">
        {cards.map(([value, title, body, image]) => (
          <Card className={`theme-preview ${value}`} key={value} title={title}>
            <img src={image} alt={`${title}參考圖`} />
            <p>{body}</p>
            <Button>預覽</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CrudTable({ title, rows }: { title: string; rows: Array<Record<string, unknown>> }) {
  return (
    <Card title={title} extra={<Button type="primary">新增</Button>}>
      <Table dataSource={rows} columns={[
        { title: "名稱", dataIndex: "title" },
        { title: "狀態", dataIndex: "status", render: (value) => <Tag color={String(value).includes("LIVE") || String(value).includes("PUBLISHED") ? "green" : "gold"}>{String(value)}</Tag> },
        { title: "設定", dataIndex: "pinned" },
        { title: "排序/數值", dataIndex: "order" },
        { title: "操作", render: () => <Space><Button>編輯</Button><Button>發布/下架</Button></Space> }
      ]} />
    </Card>
  );
}

function Root() {
  const [selected, setSelected] = React.useState("dashboard");
  const title = menuItems.find((item) => item.key === selected)?.label?.toString() ?? "後台";
  const content = selected === "dashboard" ? <Dashboard /> :
    selected === "homepage" ? <HomepageSettings /> :
    selected === "cms" ? <CmsPages /> :
    selected === "style" ? <StyleManagement /> :
    selected === "announcements" ? <CrudTable title="活動公告" rows={[{ key: 1, title: "春季毛線委託活動", status: "PUBLISHED", pinned: "置頂", order: 1 }]} /> :
    selected === "platform-products" ? <CrudTable title="秦時線自營選品" rows={[{ key: 1, title: "秦時線・柔霧羊毛線組", status: "LIVE", pinned: "FULL_PAYMENT", order: 42 }]} /> :
    selected === "ads" ? <CrudTable title="織女廣告管理" rows={[{ key: 1, title: "柔霧圍巾訂製", status: "LIVE", pinned: "slot 1", order: "PAID" }]} /> :
    selected === "media" ? <CrudTable title="媒體素材" rows={[{ key: 1, title: "/brand/qinshixian-logo-official-cropped.png", status: "ACTIVE", pinned: "LOGO", order: 1 }]} /> :
    selected === "knitters" ? <CrudTable title="織女審核" rows={[{ key: 1, title: "待審核織女", status: "PENDING_REVIEW", pinned: "圍巾/披肩", order: "-" }]} /> :
    selected === "audit" ? <CrudTable title="Audit Logs" rows={[{ key: 1, title: "UPDATE_HOMEPAGE_SETTINGS", status: "OK", pinned: "homepage_settings", order: "latest" }]} /> :
    <CrudTable title={title} rows={[{ key: 1, title: "MVP 資料", status: "ACTIVE", pinned: "秦時線", order: 1 }]} />;

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#3F766F", borderRadius: 8, fontFamily: '"PingFang TC", "Microsoft JhengHei", system-ui, sans-serif' } }}>
      <App>
        <Layout className="admin-shell">
          <Sider width={252} theme="light" className="sider">
            <div className="admin-brand"><img src="/brand/qinshixian-logo-official-cropped.png" alt="秦時線" /></div>
            <Menu mode="inline" selectedKeys={[selected]} items={menuItems} onClick={(event) => setSelected(event.key)} />
          </Sider>
          <Layout>
            <Header className="header">秦時線管理後台</Header>
            <Content className="content">{content}</Content>
          </Layout>
        </Layout>
      </App>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
