// 圖文介紹
export interface Feature {
  title: string;
  desc: string;
  img: string;
}

// 技術介紹
export interface TechItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Styling';
}

// 測試賬號
export interface TestAccount {
  role: string;
  user: string;
  pass: string;
  desc: string;
  color: string;
}

// 報價
export interface PricingPlan {
  name: string;
  price: number | '客製化';
  desc: string;
  features: string[];
  button: string;
  highlight: boolean;
  action: () => void;
}

// 功能截圖介面
export interface ScreenFeature {
  pc: string;
  title: string;
  subtitle: string;
  desc: string;
  tags: string[];
  icon: string;
}

// 聯繫表單
export interface ContactForm {
  name: string;
  email: string;
  company: string;
  message: string;
}

// 核心價值
export interface CoreValue {
  title: string;
  desc: string;
  icon: string;
}

// 里程碑
export interface Milestone {
  year: string;
  title: string;
  desc: string;
}

// FAQ 資料介面
export interface FAQItem {
  q: string;
  a: string;
}
