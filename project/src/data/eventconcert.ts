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
    banner: "/banners/concert/Bigmountain.jpg",           
    stageImage: "/stages/bmmf15.png",      
    description:
      "เงื่อนไขการซื้อบัตร / ช่องทางชำระเงิน / เวลาเปิดประตู / สิ่งที่ควรรู้ก่อนเข้าชม ฯลฯ",
    prices: [
      { name: "VIP", price: 3500 },
      { name: "A", price: 2500 },
      { name: "B", price: 1500 },
    ],
  },
  {
    id: "oasis-merch-day",
    title: "OASIS | MERCH DAY",
    subtitle: "สินค้าพิเศษจำนวนจำกัด",
    dateRange: "Sat 12 Oct 2025",
    Time: "10:00 AM - 8:00 PM",
    venue: "Central Court",
    banner: "/banners/concert/oasis.png",
    stageImage: "/stages/flat.png",
    description: "รายละเอียดงานสินค้า, เวลาจัดงาน, เงื่อนไขการแลกคิว, ฯลฯ",
    prices: [{ name: "Entry", price: 0 }],
  },
  {
    id: "Bangsaen Fest",
    title: "Bangsaen Fest",
    subtitle: "Bangsaen Fest 2025' งานเฟส T-POP สุดยิ่งใหญ่ ครั้งแรกในบางแสน ที่จะทำให้กรี๊ดจนเสียงหลง",
    dateRange: "Sat 15 Sep 2025",
    Time: "10:00 AM",
    venue: "Bangsaen Heritage Convention Center",
    banner: "/banners/concert/BangsaenFest.png",
    stageImage: "/stages/flat.png",
    description: "รายละเอียดงานสินค้า, เวลาจัดงาน, เงื่อนไขการแลกคิว, ฯลฯ",
    prices:[
      { name: "VIP", price: 12900 },
      { name: "A", price: 2190 },
      { name: "B", price: 1790 },
    ],
  },
  {
    id: "Chang Music ",
    title: "Chang Music Connection presents 'เชียงใหญ่เฟส 6'",
    subtitle: "อ้ายหมีพาเทศกาลดนตรีที่ใหญ่ที่สุดในภาคเหนือกลับมาสร้างความม่วนจอยกับทุกคนเป็นครั้งที่ 6 แล้วเจ้า!",
    dateRange: "29-30 NOVEMBER 2025",
    Time: "Door Open : 01:00 P.M.",
    venue: "Royal Train Garden Resort จ.เชียงใหม่",
    banner: "/banners/concert/CMFeast.jpg",
    stageImage: "/stages/flat.png",
    description: "รายละเอียดงานสินค้า, เวลาจัดงาน, เงื่อนไขการแลกคิว, ฯลฯ",
    prices: [{ name: "Pro Chang", price: 1450 }],
  },
  {
    id: "2025-bambam-hometown-concert-in-bangkok",
    title: "2025 BamBam HOMETOWN",
    subtitle: "2025 BamBam HOMETOWN Concert in Bangkok",
    dateRange: "วันเสาร์ที่ 22 - วันอาทิตย์ที่ 23 พฤศจิกายน 2568",
    Time: "12:00 PM",
    venue: "ธันเดอร์โดม สเตเดี้ยม เมืองทองธานี",
    banner: "/banners/concert/2025-bambam-hometown-concert-in-bangkok.png",
    stageImage: "/stages/flat.png",
    description: "รายละเอียดงานสินค้า, เวลาจัดงาน, เงื่อนไขการแลกคิว, ฯลฯ",
    prices: [{ name: "Pro Chang", price: 1450 }],
  },
];