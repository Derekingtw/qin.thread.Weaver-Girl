import { createHash } from "node:crypto";
import { PrismaClient, RoleColor } from "@prisma/client";

const prisma = new PrismaClient();

function hash(value: string) {
  return createHash("sha256").update(`${process.env.PHONE_HASH_SALT ?? "dev_salt"}:${value}`).digest("hex");
}

function enc(value: string) {
  return Buffer.from(value, "utf8").toString("base64");
}

async function reset() {
  await prisma.auditLog.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.adEvent.deleteMany();
  await prisma.adPlacement.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.adApplication.deleteMany();
  await prisma.adSlot.deleteMany();
  await prisma.adPackage.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.homepageSetting.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.orderStatusLog.deleteMany();
  await prisma.settlement.deleteMany();
  await prisma.supportMessage.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.order.deleteMany();
  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.platformInventory.deleteMany();
  await prisma.readyMadeOffer.deleteMany();
  await prisma.knitterApplicationFile.deleteMany();
  await prisma.knitterProfile.deleteMany();
  await prisma.buyerProfile.deleteMany();
  await prisma.employeeProfile.deleteMany();
  await prisma.employeeInvite.deleteMany();
  await prisma.consentLog.deleteMany();
  await prisma.webSession.deleteMany();
  await prisma.phoneVerification.deleteMany();
  await prisma.trackingEvent.deleteMany();
  await prisma.trackingLink.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.leadSource.deleteMany();
  await prisma.serviceAssignment.deleteMany();
  await prisma.userTagRelation.deleteMany();
  await prisma.customerTag.deleteMany();
  await prisma.userRoleRecord.deleteMany();
  await prisma.user.deleteMany();
}

async function createUser(phone: string, publicCode: string, roleColor: RoleColor) {
  return prisma.user.create({
    data: {
      phone_encrypted: enc(phone),
      phone_hash: hash(phone),
      public_code: publicCode,
      role_color: roleColor,
      status: "ACTIVE",
      preferred_locale: "zh-Hant"
    }
  });
}

async function main() {
  await reset();

  const superAdmin = await createUser("13800000001", "80000001", "gray");
  const marketing = await createUser("13800000006", "80000006", "gray");
  const reviewer = await createUser("13800000002", "80000002", "gray");
  const ops = await createUser("13800000003", "80000003", "gray");
  const finance = await createUser("13800000004", "80000004", "gray");
  const customerService = await createUser("13800000005", "80000005", "gray");

  const employees = [
    [superAdmin, "SUPER_ADMIN", "秦時線超級管理員"],
    [marketing, "MARKETING", "品牌與行銷"],
    [reviewer, "REVIEWER", "審核專員"],
    [ops, "OPS", "營運出貨"],
    [finance, "FINANCE", "財務"],
    [customerService, "CUSTOMER_SERVICE", "客服"]
  ] as const;

  for (const [user, role, name] of employees) {
    await prisma.userRoleRecord.create({ data: { user_id: user.id, role: "EMPLOYEE" } });
    await prisma.employeeProfile.create({ data: { user_id: user.id, role, name, status: "ACTIVE" } });
  }

  await prisma.employeeInvite.create({
    data: {
      invite_code_hash: hash("QIN-STAFF-2026"),
      role: "MARKETING",
      created_by: superAdmin.id,
      expires_at: new Date("2027-01-01T00:00:00.000Z")
    }
  });

  const buyer = await createUser("13900000001", "10000001", "blue");
  await prisma.userRoleRecord.create({ data: { user_id: buyer.id, role: "BUYER" } });
  await prisma.buyerProfile.create({ data: { user_id: buyer.id, nickname: "暖線委託人" } });
  await prisma.consentLog.createMany({
    data: [
      { user_id: buyer.id, phone_hash: buyer.phone_hash, policy_type: "TERMS", policy_version: "2026-05-13" },
      { user_id: buyer.id, phone_hash: buyer.phone_hash, policy_type: "PRIVACY", policy_version: "2026-05-13" }
    ]
  });

  const pendingKnitter = await createUser("13900000002", "20000001", "purple");
  await prisma.userRoleRecord.create({ data: { user_id: pendingKnitter.id, role: "KNITTER" } });
  await prisma.knitterProfile.create({
    data: {
      user_id: pendingKnitter.id,
      display_name: "待審核織女",
      skills: ["圍巾", "毛線包"],
      intro: "喜歡柔和色系與日常手作，正在提交作品等待秦時線審核。",
      payout_account_encrypted: enc("pending payout account"),
      application_status: "PENDING_REVIEW"
    }
  });

  const approvedKnitter = await createUser("13900000003", "20000002", "purple");
  await prisma.userRoleRecord.create({ data: { user_id: approvedKnitter.id, role: "KNITTER" } });
  const approvedProfile = await prisma.knitterProfile.create({
    data: {
      user_id: approvedKnitter.id,
      display_name: "青霧線坊",
      skills: ["毛衣", "圍巾", "禮物訂製"],
      intro: "擅長高級手作毛線作品，接受平台協調委託與品質驗收流程。",
      payout_account_encrypted: enc("approved payout account"),
      application_status: "APPROVED",
      approved_by: reviewer.id,
      approved_at: new Date()
    }
  });
  await prisma.knitterApplicationFile.create({
    data: { knitter_id: approvedProfile.id, file_url: "/images/product-yarn.svg", file_type: "WORK_IMAGE" }
  });

  await prisma.homepageSetting.create({
    data: {
      hero_badge_zh_hant: "平台交易・安心委託・溫柔陪伴",
      hero_badge_zh_hans: "平台交易・安心委托・温柔陪伴",
      hero_slogan_zh_hant: "讓每一件手作，都被溫柔對待",
      hero_slogan_zh_hans: "让每一件手作，都被温柔对待",
      hero_subtitle_zh_hant: "我們串起想像與雙手的溫度，從委託到交付，讓美好在信任中誕生。",
      hero_subtitle_zh_hans: "我们串起想象与双手的温度，从委托到交付，让美好在信任中诞生。",
      primary_cta_text_zh_hant: "開始委託",
      primary_cta_text_zh_hans: "开始委托",
      primary_cta_url: "/works",
      secondary_cta_text_zh_hant: "探索作品",
      secondary_cta_text_zh_hans: "探索作品",
      secondary_cta_url: "/works",
      hero_image_url: "/brand/hero-qinshixian-yarn.png",
      hero_image_alt_zh_hant: "秦時線毛線與編織工具形象圖",
      hero_image_alt_zh_hans: "秦时线毛线与编织工具形象图",
      show_hero_stat_card: false,
      hero_stat_label_zh_hant: "已完成委託",
      hero_stat_label_zh_hans: "已完成委托",
      hero_stat_value: "2,341 件",
      hero_stat_extra_zh_hant: "好評率 99%",
      hero_stat_extra_zh_hans: "好评率 99%",
      trust_point_1_zh_hant: "安心交易",
      trust_point_1_zh_hans: "安心交易",
      trust_point_2_zh_hant: "專業協調",
      trust_point_2_zh_hans: "专业协调",
      trust_point_3_zh_hant: "品質驗收",
      trust_point_3_zh_hans: "品质验收",
      updated_by: marketing.id
    }
  });

  await prisma.announcement.createMany({
    data: [
      { title_zh_hant: "春季毛線委託活動", title_zh_hans: "春季毛线委托活动", summary_zh_hant: "精選春季色系與入門委託流程，平台協調每一步。", summary_zh_hans: "精选春季色系与入门委托流程，平台协调每一步。", image_url: "/images/announcement.svg", pinned: true, sort_order: 1, status: "PUBLISHED", created_by: marketing.id },
      { title_zh_hant: "新織女入駐招募", title_zh_hans: "新织女入驻招募", summary_zh_hant: "提交作品與資料，通過人工審核後即可接單。", summary_zh_hans: "提交作品与资料，通过人工审核后即可接单。", image_url: "/images/announcement.svg", sort_order: 2, status: "PUBLISHED", created_by: marketing.id },
      { title_zh_hant: "平台自營材料包上新", title_zh_hans: "平台自营材料包上新", summary_zh_hant: "柔霧羊毛線組、工具包與暖心禮盒陸續上架。", summary_zh_hans: "柔雾羊毛线组、工具包与暖心礼盒陆续上架。", image_url: "/images/announcement.svg", sort_order: 3, status: "PUBLISHED", created_by: marketing.id }
    ]
  });

  await prisma.mediaAsset.createMany({
    data: [
      { url: "/brand/hero-qinshixian-yarn.png", asset_type: "IMAGE", usage: "HOME_HERO", original_name: "hero-qinshixian-yarn.png", created_by: marketing.id },
      { url: "/brand/qinshixian-logo.svg", asset_type: "IMAGE", usage: "LOGO", original_name: "qinshixian-logo.svg", created_by: marketing.id },
      { url: "/images/announcement.svg", asset_type: "IMAGE", usage: "ANNOUNCEMENT", original_name: "announcement.svg", created_by: marketing.id },
      { url: "/images/product-yarn.svg", asset_type: "IMAGE", usage: "PLATFORM_PRODUCT", original_name: "product-yarn.svg", created_by: marketing.id },
      { url: "/images/ad-yarn.svg", asset_type: "IMAGE", usage: "AD", original_name: "ad-yarn.svg", created_by: marketing.id }
    ]
  });

  const listing = await prisma.listing.create({
    data: {
      created_by_user_id: approvedKnitter.id,
      listing_type: "KNITTER_SERVICE",
      cooperation_mode: "COMMISSION_5",
      title: "柔霧圍巾訂製",
      description: "以柔霧色系毛線手作，平台協調需求與品質驗收。",
      price_cents: 68000,
      delivery_days: 14,
      payment_mode: "DEPOSIT_50",
      status: "LIVE",
      reviewed_by: reviewer.id,
      reviewed_at: new Date(),
      is_platform_featured: true,
      images: { create: [{ image_url: "/images/product-yarn.svg", sort_order: 1 }] }
    }
  });

  const productInputs = [
    ["秦時線・柔霧羊毛線組", "溫柔莫蘭迪色系羊毛線，適合圍巾與小披肩。", 38000, 42, "/images/product-yarn.svg"],
    ["初學者編織工具包", "針、記號扣、收納袋與入門指南一次備齊。", 68000, 18, "/images/ad-yarn.svg"],
    ["莫蘭迪色系毛線組", "平台買斷庫存，色系柔和，適合禮物委託。", 52000, 26, "/images/hero-yarn.svg"],
    ["手作禮盒・暖心系列", "自營禮盒，可全額或訂金 50% 支付。", 88000, 12, "/images/gift-box.svg"]
  ] as const;
  for (const [title, description, price, stock, imageUrl] of productInputs) {
    await prisma.listing.create({
      data: {
        created_by_user_id: marketing.id,
        listing_type: "PLATFORM_PRODUCT",
        cooperation_mode: "PLATFORM_OWNED_INVENTORY",
        title,
        description,
        price_cents: price,
        stock_quantity: stock,
        payment_mode: title.includes("禮盒") ? "DEPOSIT_50" : "FULL_PAYMENT",
        publish_channel: "ADMIN",
        status: "LIVE",
        is_platform_featured: true,
        images: { create: [{ image_url: imageUrl, sort_order: 1 }] }
      }
    });
  }

  const adPackages = await Promise.all([
    prisma.adPackage.create({ data: { name_zh_hant: "暖線曝光 7 天 99 元", name_zh_hans: "暖线曝光 7 天 99 元", duration_days: 7, price_cents: 9900, sort_order: 1 } }),
    prisma.adPackage.create({ data: { name_zh_hant: "人氣加溫 14 天 168 元", name_zh_hans: "人气加温 14 天 168 元", duration_days: 14, price_cents: 16800, sort_order: 2 } }),
    prisma.adPackage.create({ data: { name_zh_hant: "主推精選 30 天 299 元", name_zh_hans: "主推精选 30 天 299 元", duration_days: 30, price_cents: 29900, sort_order: 3 } })
  ]);
  const slots = await Promise.all([1, 2, 3].map((index) =>
    prisma.adSlot.create({
      data: {
        code: `HOME_KNITTER_PROMO_${index}`,
        name_zh_hant: `首頁織女推廣 ${index}`,
        name_zh_hans: `首页织女推广 ${index}`,
        slot_index: index
      }
    })
  ));
  const liveAd = await prisma.adApplication.create({
    data: {
      knitter_id: approvedKnitter.id,
      listing_id: listing.id,
      package_id: adPackages[2].id,
      ad_title_zh_hant: "青霧線坊・柔霧圍巾主推",
      ad_title_zh_hans: "青雾线坊・柔雾围巾主推",
      ad_subtitle_zh_hant: "織女付費推廣，僅連至平台內作品詳情頁。",
      ad_subtitle_zh_hans: "织女付费推广，仅连至平台内作品详情页。",
      ad_image_url: "/images/ad-yarn.svg",
      status: "LIVE",
      reviewed_by: reviewer.id,
      reviewed_at: new Date(),
      paid_at: new Date(),
      preferred_slot_index: 1
    }
  });
  await prisma.payment.create({
    data: { ad_application_id: liveAd.id, payment_type: "AD_FEE", amount_cents: 29900, provider: "MOCK", provider_transaction_id: "mock_ad_live_001", idempotency_key: `ad:${liveAd.id}`, status: "PAID", paid_at: new Date() }
  });
  await prisma.adPlacement.create({
    data: { ad_application_id: liveAd.id, ad_slot_id: slots[0].id, starts_at: new Date(Date.now() - 86400000), ends_at: new Date(Date.now() + 29 * 86400000), status: "LIVE", created_by: marketing.id }
  });

  await prisma.cmsPage.createMany({
    data: [
      { slug: "terms", title: "使用者協議", content: "秦時線 MVP 使用者協議。", status: "PUBLISHED", created_by: superAdmin.id },
      { slug: "privacy", title: "隱私權政策", content: "秦時線 MVP 隱私權政策。", status: "PUBLISHED", created_by: superAdmin.id }
    ]
  });
  await prisma.systemSetting.create({ data: { key: "payment.deposit_rate", value: { rate: 0.5 }, updated_by: superAdmin.id } });
  await prisma.auditLog.create({
    data: { actor_user_id: reviewer.id, action: "APPROVE_KNITTER", entity_type: "knitter_profiles", entity_id: approvedProfile.id, after: { application_status: "APPROVED" } }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
