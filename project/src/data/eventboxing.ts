// src/data/eventboxing.ts

export type PriceTier = {
  name: string;
  price: number;
};

export type Event = {
  id: string;
  title: string;
  subtitle?: string;
  banner: string;
  dateRange: string;
  stageImage: string;
  venue: string;
  description: string;
  prices: PriceTier[];
  Time?: string;
};

export const EVENTS: Event[] = [
  {
    id: "one-fight-night-36",
    title: "ONE Fight Night 36",
    subtitle: "Prajancha vs. Di Bella II",
    dateRange: "Sat 4 Oct 2025",
    venue: "Lumpinee Stadium, Bangkok",
    banner: "/banners/one36.jpg",
    stageImage: "/stages/one36.png",
    description:
      "เงื่อนไขการซื้อตั๋ว / ช่องทางชำระเงิน / เวลาเปิดประตู / สิ่งที่ควรรู้ก่อนเข้าชม ฯลฯ",
    prices: [
      { name: "VIP", price: 3500 },
      { name: "A", price: 2500 },
      { name: "B", price: 1500 },
    ],
    Time: "19:00",
  },
];
