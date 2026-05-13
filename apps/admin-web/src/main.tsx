import React from "react";
import ReactDOM from "react-dom/client";
import { App, Button, Card, ConfigProvider, Form, Input, Layout, Menu, Select, Space, Statistic, Switch, Table, Tag } from "antd";
import {
  AuditOutlined,
  DashboardOutlined,
  DollarOutlined,
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
  { key: "announcements", icon: <NotificationOutlined />, label: "活動公告" },
  { key: "platform-products", icon: <ShoppingOutlined />, label: "平台自營商品" },
  { key: "ads", icon: <QrcodeOutlined />, label: "織女廣告管理" },
  { key: "media", icon: <PictureOutlined />, label: "媒體素材" },
  { key: "knitters", icon: <TeamOutlined />, label: "織女審核" },
  { key: "orders", icon: <ShoppingOutlined />, label: "訂單與出貨" },
  { key: "settlements", icon: <DollarOutlined />, label: "付款與結算" },
  { key: "tickets", icon: <MessageOutlined />, label: "客服 ticket" },
  { key: "cms", icon: <SettingOutlined />, label: "CMS" },
  { key: "audit", icon: <AuditOutlined />, label: "Audit Logs" }
];

function Dashboard() {
  const stats = [
    ["今日註冊", 24],
    ["待審核織女", 5],
    ["LIVE 作品", 18],
    ["平台自營商品", 4],
    ["廣告收入", "¥299"],
    ["待處理客服", 3]
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
      headers: { "Content-Type": "application/json", "x-user-id": localStorage.getItem("qinshixian_admin_user_id") ?? "" },
      body: JSON.stringify(values)
    }).catch(() => undefined);
  }

  return (
    <div className="stack">
      <Card title="首頁 Hero 與文案設定">
        <Form
          form={form}
          layout="vertical"
          className="wide-form"
          initialValues={{
            hero_badge_zh_hant: "平台交易・安心委託・溫柔陪伴",
            hero_slogan_zh_hant: "讓每一件手作，都被溫柔對待",
            hero_subtitle_zh_hant: "我們串起想像與雙手的溫度，從委託到交付，讓美好在信任中誕生。",
            primary_cta_text_zh_hant: "開始委託",
            primary_cta_url: "/works",
            secondary_cta_text_zh_hant: "探索作品",
            secondary_cta_url: "/works",
            hero_image_url: "/brand/hero-qinshixian-yarn.png",
            hero_image_alt_zh_hant: "秦時線毛線與編織工具形象圖",
            show_hero_stat_card: false,
            hero_stat_label_zh_hant: "已完成委託",
            hero_stat_value: "2,341 件",
            hero_stat_extra_zh_hant: "好評率 99%",
            trust_point_1_zh_hant: "安心交易",
            trust_point_2_zh_hant: "專業協調",
            trust_point_3_zh_hant: "品質驗收"
          }}
          onFinish={submit}
        >
          <div className="form-grid">
            <Form.Item label="Hero 小標籤（繁）" name="hero_badge_zh_hant"><Input /></Form.Item>
            <Form.Item label="Hero 小標籤（简）" name="hero_badge_zh_hans"><Input /></Form.Item>
            <Form.Item label="主 Slogan（繁）" name="hero_slogan_zh_hant"><Input /></Form.Item>
            <Form.Item label="主 Slogan（简）" name="hero_slogan_zh_hans"><Input /></Form.Item>
            <Form.Item label="副標題（繁）" name="hero_subtitle_zh_hant"><Input.TextArea rows={3} /></Form.Item>
            <Form.Item label="副標題（简）" name="hero_subtitle_zh_hans"><Input.TextArea rows={3} /></Form.Item>
            <Form.Item label="主按鈕文字" name="primary_cta_text_zh_hant"><Input /></Form.Item>
            <Form.Item label="主按鈕 URL" name="primary_cta_url"><Input /></Form.Item>
            <Form.Item label="次按鈕文字" name="secondary_cta_text_zh_hant"><Input /></Form.Item>
            <Form.Item label="次按鈕 URL" name="secondary_cta_url"><Input /></Form.Item>
            <Form.Item label="Hero 圖片 URL" name="hero_image_url"><Input /></Form.Item>
            <Form.Item label="Hero 圖片 alt" name="hero_image_alt_zh_hant"><Input /></Form.Item>
            <Form.Item label="顯示統計卡片" name="show_hero_stat_card" valuePropName="checked"><Switch /></Form.Item>
            <Form.Item label="統計文字" name="hero_stat_label_zh_hant"><Input /></Form.Item>
            <Form.Item label="統計數字" name="hero_stat_value"><Input /></Form.Item>
            <Form.Item label="統計補充" name="hero_stat_extra_zh_hant"><Input /></Form.Item>
            <Form.Item label="信任點 1" name="trust_point_1_zh_hant"><Input /></Form.Item>
            <Form.Item label="信任點 2" name="trust_point_2_zh_hant"><Input /></Form.Item>
            <Form.Item label="信任點 3" name="trust_point_3_zh_hant"><Input /></Form.Item>
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

function Announcements() {
  return <CrudTable title="活動公告" rows={[
    { key: 1, title: "春季毛線委託活動", status: "PUBLISHED", pinned: "是", order: 1 },
    { key: 2, title: "新織女入駐招募", status: "PUBLISHED", pinned: "否", order: 2 }
  ]} />;
}

function PlatformProducts() {
  return <CrudTable title="平台自營商品" rows={[
    { key: 1, title: "秦時線・柔霧羊毛線組", status: "LIVE", pinned: "FULL_PAYMENT", order: 42 },
    { key: 2, title: "手作禮盒・暖心系列", status: "LIVE", pinned: "DEPOSIT_50", order: 12 }
  ]} />;
}

function Ads() {
  return <div className="stack">
    <Card title="推廣方案管理">
      <Table pagination={false} dataSource={[
        { key: 1, name: "暖線曝光 7 天 99 元", days: 7, price: "¥99" },
        { key: 2, name: "人氣加溫 14 天 168 元", days: 14, price: "¥168" },
        { key: 3, name: "主推精選 30 天 299 元", days: 30, price: "¥299" }
      ]} columns={[{ title: "方案", dataIndex: "name" }, { title: "天數", dataIndex: "days" }, { title: "價格", dataIndex: "price" }]} />
    </Card>
    <CrudTable title="廣告申請列表" rows={[
      { key: 1, title: "青霧線坊・柔霧圍巾主推", status: "LIVE", pinned: "slot 1", order: "PAID" },
      { key: 2, title: "待付款廣告", status: "APPROVED_PENDING_PAYMENT", pinned: "slot 2", order: "PENDING" }
    ]} />
  </div>;
}

function Media() {
  return <Card title="媒體素材">
    <Space direction="vertical" style={{ width: "100%" }}>
      <Form layout="inline">
        <Form.Item label="圖片 URL"><Input defaultValue="/brand/hero-qinshixian-yarn.png" /></Form.Item>
        <Form.Item label="Usage"><Select defaultValue="HOME_HERO" options={["HOME_HERO", "ANNOUNCEMENT", "LISTING", "AD", "PLATFORM_PRODUCT", "LOGO", "OTHER"].map((value) => ({ value }))} /></Form.Item>
        <Button type="primary">mock upload / 儲存 URL</Button>
      </Form>
      <Table pagination={false} dataSource={[{ key: 1, url: "/brand/hero-qinshixian-yarn.png", usage: "HOME_HERO" }]} columns={[{ title: "URL", dataIndex: "url" }, { title: "用途", dataIndex: "usage" }]} />
    </Space>
  </Card>;
}

function CrudTable({ title, rows }: { title: string; rows: Array<Record<string, unknown>> }) {
  return (
    <Card title={title} extra={<Button type="primary">新增</Button>}>
      <Table dataSource={rows} columns={[
        { title: "名稱", dataIndex: "title" },
        { title: "狀態", dataIndex: "status", render: (value) => <Tag color={String(value).includes("LIVE") || String(value).includes("PUBLISHED") ? "green" : "gold"}>{String(value)}</Tag> },
        { title: "設定", dataIndex: "pinned" },
        { title: "排序/庫存", dataIndex: "order" },
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
    selected === "announcements" ? <Announcements /> :
    selected === "platform-products" ? <PlatformProducts /> :
    selected === "ads" ? <Ads /> :
    selected === "media" ? <Media /> :
    selected === "knitters" ? <CrudTable title="織女審核" rows={[{ key: 1, title: "待審核織女", status: "PENDING_REVIEW", pinned: "毛衣/圍巾", order: "-" }]} /> :
    selected === "audit" ? <CrudTable title="Audit Logs" rows={[{ key: 1, title: "UPDATE_HOMEPAGE_SETTINGS", status: "OK", pinned: "homepage_settings", order: "latest" }]} /> :
    <CrudTable title={title} rows={[{ key: 1, title: "MVP 資料", status: "ACTIVE", pinned: "秦時線", order: 1 }]} />;

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#3F766F", borderRadius: 8, fontFamily: '"PingFang TC", "Microsoft JhengHei", system-ui, sans-serif' } }}>
      <App>
        <Layout className="admin-shell">
          <Sider width={252} theme="light" className="sider">
            <div className="admin-brand"><img src="/brand/qinshixian-logo.svg" alt="秦時線" /></div>
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
