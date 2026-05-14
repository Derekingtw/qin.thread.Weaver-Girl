import { AnnouncementSection } from "../../components/AnnouncementSection";
import { homeData } from "../../lib/homeData";

export default function AnnouncementsPage() {
  return (
    <main>
      <section className="container section">
        <h1>活動公告</h1>
        <p className="section-subtitle">秦時線近期活動、服務規則與自營選品更新。</p>
      </section>
      <AnnouncementSection announcements={homeData.announcements} />
    </main>
  );
}
