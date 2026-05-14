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
    ["廣告收入", "¥299"],
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
      <Card title="首頁 Hero 與多語設定">
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
            hero_image_url: "/brand/hero-qinshixian-yarn.png",
            hero_image_alt_zh_hant: "秦時線毛線與編織工具形象圖",
            hero_image_alt_en: "Qin Thread yarn and knitting tools",
            show_hero_stat_card: false,
            default_style: "cozy",
            allow_style_switch: true,
            enabled_styles: ["fashion", "cozy", "chinese"]
          }}
          onFinish={submit}
        >
          <Form.Item name="hero_slogan_zh_hant" label="主 Slogan（繁）"><Input /></Form.Item>
          <Form.Item name="hero_slogan_en" label="Main Slogan（EN）"><Input /></Form.Item>
          <Form.Item name="hero_subtitle_zh_hant" label="副標題（繁）"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="hero_subtitle_en" label="Subtitle（EN）"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="hero_image_url" label="Hero 圖片 URL"><Input /></Form.Item>
          <Form.Item name="hero_image_alt_zh_hant" label="Hero 圖片 alt（繁）"><Input /></Form.Item>
          <Form.Item name="hero_image_alt_en" label="Hero image alt（EN）"><Input /></Form.Item>
          <Form.Item name="show_hero_stat_card" label="顯示統計卡片" valuePropName="checked"><Switch /></Form.Item>
          <Form.Item name="default_style" label="預設風格"><Select options={[{ value: "fashion", label: "時尚風" }, { value: "cozy", label: "溫馨風" }, { value: "chinese", label: "中國風" }]} /></Form.Item>
          <Form.Item name="allow_style_switch" label="允許前台切換風格" valuePropName="checked"><Switch /></Form.Item>
          <Form.Item name="enabled_styles" label="啟用風格"><Select mode="multiple" options={[{ value: "fashion", label: "時尚風" }, { value: "cozy", label: "溫馨風" }, { value: "chinese", label: "中國風" }]} /></Form.Item>
          <Button type="primary" htmlType="submit">儲存首頁設定</Button>
        </Form>
      </Card>
      <Card title="前台預覽">
        <div className="homepage-preview">
          <div><Tag color="green">秦時線首頁</Tag><h2>{String(slogan)}</h2><p>預覽後台設定即時效果。統計卡片：{showStat ? "顯示" : "隱藏"}</p></div>
          <img src={String(imageUrl)} alt="Hero preview" />
        </div>
      </Card>
    </div>
  );
}

function CmsPages() {
  return (
    <Card title="頁面內容管理">
      <Table
        rowKey="slug"
        pagination={false}
        dataSource={[
          { slug: "about", title: "關於秦時線", status: "PUBLISHED", locale: "繁 / 简 / EN" },
          { slug: "guarantee", title: "秦時線保障", status: "PUBLISHED", locale: "繁 / 简 / EN" },
          { slug: "terms", title: "使用者協議", status: "DRAFT", locale: "繁 / 简 / EN" },
          { slug: "privacy", title: "隱私權政策", status: "DRAFT", locale: "繁 / 简 / EN" }
        ]}
        columns={[
          { title: "Slug", dataIndex: "slug" },
          { title: "標題", dataIndex: "title" },
          { title: "語言", dataIndex: "locale" },
          { title: "狀態", dataIndex: "status", render: (value) => <Tag>{String(value)}</Tag> },
          { title: "操作", render: () => <Button>編輯</Button> }
        ]}
      />
    </Card>
  );
}

function StyleManagement() {
  return (
    <Card title="風格管理">
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Space><span>預設風格</span><Select defaultValue="cozy" style={{ width: 160 }} options={[{ value: "fashion", label: "時尚風" }, { value: "cozy", label: "溫馨風" }, { value: "chinese", label: "中國風" }]} /></Space>
        <Space><span>允許使用者切換</span><Switch defaultChecked /></Space>
        <div className="style-preview-grid">
          {[
            ["時尚風", "高級、克制、精品雜誌感"],
            ["溫馨風", "柔和、親切、手作溫度"],
            ["中國風", "雅致、國風、書卷感"]
          ].map(([title, body]) => <Card key={title} size="small"><h3>{title}</h3><p>{body}</p><Button>預覽</Button></Card>)}
        </div>
      </Space>
    </Card>
  );
}

function CrudTable({ title, rows }: { title: string; rows: Array<Record<string, unknown>> }) {
  return (
    <Card title={title} extra={<Space><Button type="primary">新增</Button><Button>匯出</Button></Space>}>
      <Table
        rowKey={(record) => String(record.key)}
        dataSource={rows}
        pagination={false}
        columns={[
          { title: "名稱", dataIndex: "title" },
          { title: "狀態", dataIndex: "status", render: (value) => <Tag>{String(value)}</Tag> },
          { title: "標記", dataIndex: "pinned" },
          { title: "排序 / 金額", dataIndex: "order" },
          { title: "操作", render: () => <Space><Button>編輯</Button><Button>發布 / 下架</Button></Space> }
        ]}
      />
    </Card>
  );
}

function Root() {
  const [selected, setSelected] = React.useState("dashboard");
  const title = menuItems.find((item) => item.key === selected)?.label?.toString() ?? "管理後台";
  const content = selected === "dashboard" ? <Dashboard /> :
    selected === "homepage" ? <HomepageSettings /> :
    selected === "cms" ? <CmsPages /> :
    selected === "style" ? <StyleManagement /> :
    selected === "announcements" ? <CrudTable title="活動公告" rows={[{ key: 1, title: "春季毛線委託活動", status: "PUBLISHED", pinned: "置頂", order: 1 }]} /> :
    selected === "platform-products" ? <CrudTable title="秦時線自營選品" rows={[{ key: 1, title: "秦時線・柔霧羊毛線組", status: "LIVE", pinned: "FULL_PAYMENT", order: 42 }]} /> :
    selected === "ads" ? <CrudTable title="織女廣告管理" rows={[{ key: 1, title: "暖線曝光 7 天", status: "LIVE", pinned: "slot 1", order: "PAID" }]} /> :
    selected === "media" ? <CrudTable title="媒體素材" rows={[{ key: 1, title: "/brand/qinshixian-logo-main.png", status: "ACTIVE", pinned: "LOGO", order: 1 }]} /> :
    selected === "knitters" ? <CrudTable title="織女審核" rows={[{ key: 1, title: "待審核織女", status: "PENDING_REVIEW", pinned: "審核 / 拒絕", order: "-" }]} /> :
    selected === "audit" ? <CrudTable title="Audit Logs" rows={[{ key: 1, title: "UPDATE_HOMEPAGE_SETTINGS", status: "OK", pinned: "homepage_settings", order: "latest" }]} /> :
    <CrudTable title={title} rows={[{ key: 1, title: "MVP 資料", status: "ACTIVE", pinned: "秦時線", order: 1 }]} />;

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#3F766F", borderRadius: 8, fontFamily: '"PingFang TC", "Microsoft JhengHei", system-ui, sans-serif' } }}>
      <App>
        <Layout className="admin-shell">
          <Sider width={252} theme="light" className="sider">
            <div className="admin-brand"><img src="/brand/qinshixian-logo-main.png" alt="秦時線" /></div>
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
