export type TrackingContext = {
  sourceId?: string;
  campaignId?: string;
  trackingLinkId?: string;
};

export class PhoneDto {
  phone!: string;
  purpose?: "REGISTER" | "LOGIN" | "BIND_PHONE";
}

export class VerifyOtpDto {
  phone!: string;
  code!: string;
  purpose?: "REGISTER" | "LOGIN" | "BIND_PHONE";
}

export class RegisterBuyerDto {
  phone!: string;
  code!: string;
  agreedTerms!: boolean;
  agreedPrivacy!: boolean;
  nickname?: string;
  tracking?: TrackingContext;
}

export class RegisterKnitterDto extends RegisterBuyerDto {
  displayName!: string;
  skills!: string[];
  intro!: string;
  workUrls?: string[];
  payoutAccount?: string;
}

export class LoginDto {
  phone!: string;
  code!: string;
}

export class CreateListingDto {
  title!: string;
  description!: string;
  priceCents!: number;
  deliveryDays?: number;
  cooperationMode?: "COMMISSION_5" | "PLATFORM_BUYOUT_SERVICE";
  laborFeeCents?: number;
  imageUrls?: string[];
}

export class CreateOrderDto {
  listingId!: string;
  buyerAddress?: string;
  tracking?: TrackingContext;
}

export class SupportMessageDto {
  messageText!: string;
}
