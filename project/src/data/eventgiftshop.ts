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
  Time: string;
  stageImage: string; 
  venue: string;
  description: string;
  prices: PriceTier[];
};

export const EVENTS: Event[] = [
  {
    id: "big-mountain-15",
    title: "Pepsi Presents Big Mountain Music Festival 15",
    subtitle: "เทศกาลดนตรีสุดยิ่งใหญ่",
    dateRange: "6–7 December 2025",
    Time: "19:00 PM",
    venue: "The Ocean, เขาใหญ่",
    banner: "/banners/bmmf15.jpg",           
    stageImage: "/stages/bmmf15.png",      
    description:
      "เงื่อนไขการซื้อบัตร / ช่องทางชำระเงิน / เวลาเปิดประตู / สิ่งที่ควรรู้ก่อนเข้าชม ฯลฯ",
    prices: [
      { name: "VIP", price: 3500 },
      { name: "A", price: 2500 },
      { name: "B", price: 1500 },
    ],
  },
];