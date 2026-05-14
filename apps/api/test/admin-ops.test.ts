import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(__dirname, "../../..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("admin operations wiring", () => {
  it("api exposes health, controlled CORS, and Render PORT", () => {
    const main = read("apps/api/src/main.ts");
    const controller = read("apps/api/src/modules/app.controller.ts");
    expect(controller).toContain('@Get("health")');
    expect(controller).toContain('service: "qinshixian-api"');
    expect(main).toContain("CORS_ORIGINS");
    expect(main).toContain("process.env.PORT");
    expect(main).not.toContain("origin: true");
  });

  it("admin web uses VITE_API_BASE_URL and bearer token auth", () => {
    const admin = read("apps/admin-web/src/main.tsx");
    expect(admin).toContain("import.meta.env.VITE_API_BASE_URL");
    expect(admin).toContain("Authorization: `Bearer ${token}`");
    expect(admin).toContain("/auth/login");
    expect(admin).toContain("/health");
    expect(admin).toContain("401：登入已過期");
    expect(admin).toContain("403：沒有權限");
  });

  it("auth keeps seeded employee login usable when OTP storage or phone salt drifts", () => {
    const auth = read("apps/api/src/modules/auth.service.ts");
    expect(auth).toContain("SEED_EMPLOYEE_PUBLIC_CODES");
    expect(auth).toContain("OTP_STORAGE_UNAVAILABLE_FOR_SEED_EMPLOYEE");
    expect(auth).toContain("public_code: SEED_EMPLOYEE_PUBLIC_CODES[phone]");
  });

  it("auth DTOs keep request bodies under the global whitelist validation pipe", () => {
    const main = read("apps/api/src/main.ts");
    const dto = read("apps/api/src/modules/dto.ts");
    expect(main).toContain("whitelist: true");
    expect(dto).toContain("class-validator");
    expect(dto).toContain("@IsString()");
    expect(dto).toContain("@IsBoolean()");
  });

  it("homepage settings and media upload endpoints are implemented", () => {
    const controller = read("apps/api/src/modules/app.controller.ts");
    expect(controller).toContain('@Get("admin/homepage-settings")');
    expect(controller).toContain('@Patch("admin/homepage-settings")');
    expect(controller).toContain('@Post("admin/media/upload")');
    expect(controller).toContain("FileInterceptor");
    expect(controller).toContain("MEDIA_MAX_SIZE_MB");
    expect(controller).toContain("UPLOAD_MEDIA_ASSET");
  });

  it("schema supports storage metadata and homepage asset link", () => {
    const schema = read("prisma/schema.prisma");
    expect(schema).toContain("enum StorageProvider");
    expect(schema).toContain("hero_image_asset_id");
    expect(schema).toContain("storage_provider StorageProvider");
    expect(schema).toContain("deleted_at    DateTime?");
  });

  it("Render and env examples use Qinshixian service names and storage env", () => {
    const render = read("render.qinshixian.yaml");
    const env = read(".env.example");
    expect(render).toContain("qinshixian-api-prod");
    expect(render).toContain("VITE_API_BASE_URL");
    expect(render).toContain("CORS_ORIGINS");
    expect(render).not.toContain("oa-");
    expect(render).not.toContain("plan: free");
    expect(env).toContain("OBJECT_STORAGE_PROVIDER");
    expect(env).toContain("R2_PUBLIC_BASE_URL");
    expect(env).toContain("OSS_ACCESS_KEY_SECRET");
  });

  it("Render deployment docs explain paid services to avoid waking pages", () => {
    const docs = read("docs/DEPLOY_RENDER.md");
    const readme = read("README.md");
    expect(docs).toContain("APPLICATION LOADING");
    expect(docs).toContain("Free Web Services spin down");
    expect(docs).toContain("must be a paid Web Service");
    expect(readme).toContain("SERVICE WAKING UP");
    expect(readme).toContain("not a Free Web Service");
  });
});
