import { PlatformProductSection } from "../../components/PlatformProductSection";
import { homeData } from "../../lib/homeData";

export default function PlatformProductsPage() {
  return (
    <main>
      <section className="container section">
        <h1>平台自營商品</h1>
        <p className="section-subtitle">秦時線官方嚴選材料包、工具包、現貨與手作禮盒。</p>
      </section>
      <PlatformProductSection products={homeData.platformProducts} />
    </main>
  );
}
