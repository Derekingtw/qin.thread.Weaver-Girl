import { AnnouncementSection } from "../../components/AnnouncementSection";
import { homeData } from "../../lib/homeData";

export default function AnnouncementsPage() {
  return (
    <main>
      <section className="container section">
        <h1>活動公告</h1>
        <p className="section-subtitle">最新平台活動、織女招募與自營商品資訊。</p>
      </section>
      <AnnouncementSection announcements={homeData.announcements} />
    </main>
  );
}
