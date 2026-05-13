import { CommissionListingSection } from "../../components/CommissionListingSection";
import { homeData } from "../../lib/homeData";

export default function WorksPage() {
  return (
    <main>
      <section className="container section">
        <div className="section-head">
          <div>
            <h1>找作品</h1>
            <p className="section-subtitle">平台審核上架的手作委託，買家與織女資料全程隔離。</p>
          </div>
        </div>
      </section>
      <CommissionListingSection listings={homeData.commissionListings} />
    </main>
  );
}
