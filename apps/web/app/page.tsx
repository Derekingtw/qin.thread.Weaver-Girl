import { AnnouncementSection } from "../components/AnnouncementSection";
import { CommissionListingSection } from "../components/CommissionListingSection";
import { CooperationModes } from "../components/CooperationModes";
import { HomeHero } from "../components/HomeHero";
import { KnitterJoinCTA } from "../components/KnitterJoinCTA";
import { PlatformProductSection } from "../components/PlatformProductSection";
import { ProcessStrip } from "../components/ProcessStrip";
import { PromotedKnitterAds } from "../components/PromotedKnitterAds";
import { getHomeData } from "../lib/homeData";

export default async function HomePage() {
  const homeData = await getHomeData();
  return (
    <main className="home-page">
      <HomeHero settings={homeData.homepageSettings} />
      <ProcessStrip steps={homeData.processSteps} />
      <AnnouncementSection announcements={homeData.announcements} />
      <PromotedKnitterAds ads={homeData.promotedAds} />
      <CommissionListingSection listings={homeData.commissionListings} />
      <PlatformProductSection products={homeData.platformProducts} />
      <CooperationModes modes={homeData.cooperationModes} />
      <KnitterJoinCTA />
    </main>
  );
}
