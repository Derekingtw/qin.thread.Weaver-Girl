export type ContactInfoHit = {
  type:
    | "CN_MOBILE"
    | "TW_MOBILE"
    | "EMAIL"
    | "WECHAT"
    | "LINE"
    | "TELEGRAM"
    | "WHATSAPP"
    | "QQ"
    | "CONTACT_HINT";
  value: string;
};

const patterns: Array<{ type: ContactInfoHit["type"]; pattern: RegExp }> = [
  { type: "CN_MOBILE", pattern: /(?:\+?86[-\s]?)?1[3-9]\d{9}/i },
  { type: "TW_MOBILE", pattern: /(?:\+?886[-\s]?)?0?9\d{8}/i },
  { type: "EMAIL", pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i },
  { type: "WECHAT", pattern: /(微信|wechat|weixin|wx|v信)[:：\s-]*[a-zA-Z0-9_-]{4,}/i },
  { type: "LINE", pattern: /(line)[:：\s-]*[a-zA-Z0-9_.-]{3,}/i },
  { type: "TELEGRAM", pattern: /(telegram|tg)[:：\s@-]*[a-zA-Z0-9_]{4,}/i },
  { type: "WHATSAPP", pattern: /(whatsapp|wa)[:：\s-]*(?:\+?\d[\d\s-]{6,})/i },
  { type: "QQ", pattern: /(QQ|qq)[:：\s-]*[1-9][0-9]{4,}/i },
  {
    type: "CONTACT_HINT",
    pattern: /(加我|私聊|私訊|联系我|聯繫我|联系方式|看主页|看主頁|主页有|主頁有)/i
  }
];

export function detectContactInfo(text: string): ContactInfoHit[] {
  const hits: ContactInfoHit[] = [];
  for (const item of patterns) {
    const match = text.match(item.pattern);
    if (match?.[0]) hits.push({ type: item.type, value: match[0] });
  }
  return hits;
}

export function hasContactInfo(text: string) {
  return detectContactInfo(text).length > 0;
}
