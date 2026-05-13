export type StoredObject = {
  url: string;
  provider: "mock" | "s3" | "cloudflare-r2" | "tencent-cos" | "aliyun-oss";
};

export interface ObjectStorageProvider {
  putObject(input: { key: string; body: Buffer; contentType?: string }): Promise<StoredObject>;
}

export class MockStorageProvider implements ObjectStorageProvider {
  async putObject(input: { key: string }) {
    return { url: `/mock-uploads/${input.key}`, provider: "mock" as const };
  }
}

export class S3StorageProvider implements ObjectStorageProvider {
  async putObject(): Promise<StoredObject> {
    throw new Error("S3 object storage is reserved for production configuration.");
  }
}

export class CloudflareR2Provider implements ObjectStorageProvider {
  async putObject(): Promise<StoredObject> {
    throw new Error("Cloudflare R2 object storage is reserved for production configuration.");
  }
}

export class TencentCosProvider implements ObjectStorageProvider {
  async putObject(): Promise<StoredObject> {
    throw new Error("Tencent COS object storage is reserved for production configuration.");
  }
}

export class AliyunOssProvider implements ObjectStorageProvider {
  async putObject(): Promise<StoredObject> {
    throw new Error("Aliyun OSS object storage is reserved for production configuration.");
  }
}
