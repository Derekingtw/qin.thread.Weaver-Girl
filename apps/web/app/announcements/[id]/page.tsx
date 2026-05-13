import Link from "next/link";
import { homeData } from "../../../lib/homeData";

export default function AnnouncementDetailPage({ params }: { params: { id: string } }) {
  const item = homeData.announcements.find((announcement) => announcement.id === params.id) ?? homeData.announcements[0];
  return (
    <main className="container section">
      <Link className="section-link" href="/announcements">‹ 返回公告</Link>
      <article className="card announcement-card" style={{ marginTop: 16 }}>
        <span className="tag">{item.pinned ? "置頂" : "公告"}</span>
        <h1>{item.title.zhHant}</h1>
        <p className="section-subtitle">{item.summary.zhHant}</p>
        <p className="date">{item.date}</p>
      </article>
    </main>
  );
}
