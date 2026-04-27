import { Lang } from "@/i18n/translations";

export type Category =
  | "anime"
  | "figure"
  | "gacha"
  | "mangacafe"
  | "cafecollab"
  | "arttoy"
  | "maid"
  | "butler";

export type VerifyStatus = "verified" | "partial" | "unverified";

export interface LocalizedText {
  ko: string;
  en?: string;
  ja?: string;
  "zh-tw"?: string;
  "zh-cn"?: string;
  vi?: string;
  th?: string;
}

export interface Shop {
  id: string;
  name: LocalizedText;
  englishName?: string;
  category: Category;
  building?: string;
  floor?: string;
  address: string;
  addressEn?: string;
  hours: string;
  hoursEn?: string;
  hoursNote?: string;
  instagram?: string;
  twitter?: string;
  threads?: string;
  naverMap?: string;
  kakaoMap?: string;
  image?: string;
  tags: string[];
  taxFree?: boolean;
  payments?: ("card" | "cash" | "kakao" | "naver")[];
  languages?: ("en" | "ja" | "zh")[];
  status: VerifyStatus;
  notes?: LocalizedText;
}

export interface CafeMenuItem {
  name: LocalizedText;
  price: number;
  expensive?: boolean;
}

export interface Cafe {
  id: string;
  name: LocalizedText;
  category: "maid" | "butler";
  address: string;
  addressEn?: string;
  hours: string;
  hoursEn?: string;
  priceLevel: 1 | 2 | 3;
  warning: LocalizedText;
  menu: CafeMenuItem[];
  instagram?: string;
  twitter?: string;
  threads?: string;
  naverMap?: string;
  kakaoMap?: string;
  image?: string;
  notes?: LocalizedText;
  badge?: LocalizedText;
}

export interface Route {
  id: string;
  emoji: string;
  title: LocalizedText;
  stops: string[];
  durationHours: number;
  budgetMin: number;
  budgetMax: number;
  difficulty: "beginner" | "advanced";
  colorClass: string;
}
