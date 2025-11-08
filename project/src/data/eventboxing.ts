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
    banner: "/banners/sport/one-fight-night-36.jpg",
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
  {
    id: "one-fight-night-38",
    title: "ONE Fight Night 38",
    subtitle: "ONE Fight Night 38 : Andrade vs. Baatarkhuu",
    dateRange: "Sat 6 Dec 2025",
    venue: "Lumpinee Stadium, Bangkok",
    banner: "/banners/sport/one-fight-night-38.png",
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
  {
    id: "u23-international-matches-thailand-vs-india",
    title: "U23 International Match Thailand vs India",
    subtitle: "Match Thailand vs India",
    dateRange: "วันอังคารที่ 4 พฤศจิกายน 2568",
    venue: "Thammasat Stadium",
    banner: "/banners/sport/u23-international-matches-thailand-vs-india.png",
    stageImage: "/stages/one36.png",
    description:
      "เงื่อนไขการซื้อตั๋ว / ช่องทางชำระเงิน / เวลาเปิดประตู / สิ่งที่ควรรู้ก่อนเข้าชม ฯลฯ",
    prices: [
      { name: "W", price: 200 },
      { name: "E", price: 100 },
      { name: "Away", price: 200 },
    ],
    Time: "10:00 AM",
  },
  {
    id: "Thailand vs Singapore",
    title: "International Match 13 Nov 2025 : Thailand vs Singapore",
    subtitle: "Thailand vs Singapore",
    dateRange: "วันพฤหัสบดีที่ 13 พฤศจิกายน 2568",
    venue: "Thammasat Stadium, Bangkok",
    banner: "/banners/sport/ThaiVSing.png",
    stageImage: "/stages/one36.png",
    description:
      "เงื่อนไขการซื้อตั๋ว / ช่องทางชำระเงิน / เวลาเปิดประตู / สิ่งที่ควรรู้ก่อนเข้าชม ฯลฯ",
    prices: [
      { name: "W", price: 300 },
      { name: "E", price: 200  },
      { name: "N / S", price: 150  },
      { name: "AWAY", price: 300  },
    ],
    Time: "10:00 AM",
  },
];
