import { Injectable } from "@nestjs/common";

export type StorageProviderName = "MOCK" | "LOCAL_DEV" | "S3" | "R2" | "COS" | "OSS";

export type UploadInput = {
  key: string;
  body: Buffer;
  contentType: string;
};

export type UploadResult = {
  url: string;
  provider: StorageProviderName;
  key: string;
  warning?: string;
};

export interface ObjectStorageProvider {
  upload(input: UploadInput): Promise<UploadResult>;
  delete(key: string): Promise<void>;
  getPublicUrl(key: string): string;
}

export class MockStorageProvider implements ObjectStorageProvider {
  async upload(input: UploadInput): Promise<UploadResult> {
    return {
      url: `data:${input.contentType};base64,${input.body.toString("base64")}`,
      provider: "MOCK",
      key: input.key,
      warning: "OBJECT_STORAGE_PROVIDER=mock is for MVP only. Configure R2/S3/COS/OSS before using production uploads at scale."
    };
  }

  async delete(): Promise<void> {
    return undefined;
  }

  getPublicUrl(key: string) {
    return `/mock-uploads/${key}`;
  }
}

export class LocalDevStorageProvider extends MockStorageProvider {
  override async upload(input: UploadInput): Promise<UploadResult> {
    const result = await super.upload(input);
    return { ...result, provider: "LOCAL_DEV" };
  }
}

class ReservedProvider implements ObjectStorageProvider {
  constructor(private readonly provider: StorageProviderName, private readonly publicBaseUrl?: string) {}

  async upload(input: UploadInput): Promise<UploadResult> {
    if (!this.publicBaseUrl) {
      throw new Error(`${this.provider} storage is not configured. Set bucket credentials and public base URL.`);
    }
    return {
      url: `${this.publicBaseUrl.replace(/\/$/, "")}/${input.key}`,
      provider: this.provider,
      key: input.key,
      warning: `${this.provider} upload adapter is configured as a safe MVP placeholder. Wire the SDK before production binary upload.`
    };
  }

  async delete(): Promise<void> {
    return undefined;
  }

  getPublicUrl(key: string) {
    if (!this.publicBaseUrl) return key;
    return `${this.publicBaseUrl.replace(/\/$/, "")}/${key}`;
  }
}

export class S3StorageProvider extends ReservedProvider {
  constructor() { super("S3", process.env.S3_PUBLIC_BASE_URL); }
}

export class CloudflareR2Provider extends ReservedProvider {
  constructor() { super("R2", process.env.R2_PUBLIC_BASE_URL); }
}

export class TencentCosProvider extends ReservedProvider {
  constructor() { super("COS", process.env.COS_PUBLIC_BASE_URL); }
}

export class AliyunOssProvider extends ReservedProvider {
  constructor() { super("OSS", process.env.OSS_PUBLIC_BASE_URL); }
}

@Injectable()
export class ObjectStorageService {
  providerName(): StorageProviderName {
    const value = (process.env.OBJECT_STORAGE_PROVIDER ?? "mock").toLowerCase();
    if (value === "local-dev") return "LOCAL_DEV";
    if (value === "s3") return "S3";
    if (value === "r2") return "R2";
    if (value === "cos") return "COS";
    if (value === "oss") return "OSS";
    return "MOCK";
  }

  provider(): ObjectStorageProvider {
    switch (this.providerName()) {
      case "LOCAL_DEV": return new LocalDevStorageProvider();
      case "S3": return new S3StorageProvider();
      case "R2": return new CloudflareR2Provider();
      case "COS": return new TencentCosProvider();
      case "OSS": return new AliyunOssProvider();
      default: return new MockStorageProvider();
    }
  }

  upload(input: UploadInput) {
    return this.provider().upload(input);
  }
}
