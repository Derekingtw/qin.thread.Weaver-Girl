import { CommissionListingSection } from "../../components/CommissionListingSection";
import { homeData } from "../../lib/homeData";

export default function WorksPage() {
  return (
    <main>
      <section className="container section">
        <div className="section-head">
          <div>
            <h1>找作品</h1>
            <p className="section-subtitle">由秦時線協調需求、付款、驗收與交付，讓手作委託更安心。</p>
          </div>
        </div>
      </section>
      <CommissionListingSection listings={homeData.commissionListings} />
    </main>
  );
}
