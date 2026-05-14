import { PlatformProductSection } from "../../components/PlatformProductSection";
import { homeData } from "../../lib/homeData";

export default function PlatformProductsPage() {
  return (
    <main>
      <section className="container section">
        <h1>秦時線自營選品</h1>
        <p className="section-subtitle">材料包、工具、禮盒與買斷作品，由秦時線企劃、管理與出貨。</p>
      </section>
      <PlatformProductSection products={homeData.platformProducts} />
    </main>
  );
}
