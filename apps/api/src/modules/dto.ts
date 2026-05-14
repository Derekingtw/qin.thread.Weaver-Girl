import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export type TrackingContext = {
  sourceId?: string;
  campaignId?: string;
  trackingLinkId?: string;
};

export class PhoneDto {
  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  purpose?: "REGISTER" | "LOGIN" | "BIND_PHONE";
}

export class VerifyOtpDto {
  @IsString()
  phone!: string;

  @IsString()
  code!: string;

  @IsOptional()
  @IsString()
  purpose?: "REGISTER" | "LOGIN" | "BIND_PHONE";
}

export class RegisterBuyerDto {
  @IsString()
  phone!: string;

  @IsString()
  code!: string;

  @IsBoolean()
  agreedTerms!: boolean;

  @IsBoolean()
  agreedPrivacy!: boolean;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  tracking?: TrackingContext;
}

export class RegisterKnitterDto extends RegisterBuyerDto {
  @IsString()
  displayName!: string;

  @IsArray()
  skills!: string[];

  @IsString()
  intro!: string;

  @IsOptional()
  @IsArray()
  workUrls?: string[];

  @IsOptional()
  @IsString()
  payoutAccount?: string;
}

export class LoginDto {
  @IsString()
  phone!: string;

  @IsString()
  code!: string;
}

export class CreateListingDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsNumber()
  priceCents!: number;

  @IsOptional()
  @IsNumber()
  deliveryDays?: number;

  @IsOptional()
  @IsString()
  cooperationMode?: "COMMISSION_5" | "PLATFORM_BUYOUT_SERVICE";

  @IsOptional()
  @IsNumber()
  laborFeeCents?: number;

  @IsOptional()
  @IsArray()
  imageUrls?: string[];
}

export class CreateOrderDto {
  @IsString()
  listingId!: string;

  @IsOptional()
  @IsString()
  buyerAddress?: string;

  @IsOptional()
  tracking?: TrackingContext;
}

export class SupportMessageDto {
  @IsString()
  messageText!: string;
}
