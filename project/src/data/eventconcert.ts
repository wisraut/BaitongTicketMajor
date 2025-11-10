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
  {
    id: "shine-bangkok-fancon-where-we-loved-how-we-fought-and-now-we-shine",
    title: "Shine Bangkok Fancon: Where We Loved,How We Fought and Now We Shine",
    subtitle: "Where We Loved,How We Fought and Now We Shine",
    dateRange: "วันเสาร์ที่ 1 พฤศจิกายน 2568",
    Time: "18.30 น.",
    venue: "ยูเนี่ยน ฮอลล์, ศูนย์การค้ายูเนี่ยน มอลล์ /RERUN by TTM LIVE",
    banner: "/banners/concert/shine-bangkok-fancon-where-we-loved-how-we-fought-and-now-we-shine.png",           
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
    id: "yiruma-live-in-bangkok-2025",
    title: "Yiruma Live in Bangkok 2025",
    subtitle: "เทศกาลดนตรีสุดยิ่งใหญ่",
    dateRange: "วันที่ 11-12 กรกฎาคม 2568",
    Time: "10:00 น. – 23:59 น.",
    venue: "ยูโอบี ไลฟ์, เอ็มสเฟียร์",
    banner: "/banners/concert/yiruma-live-in-bangkok-2025.png",           
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
    id: "blue-live-in-asia.",
    title: "Blue Live in Asia",
    subtitle: "เทศกาลดนตรีสุดยิ่งใหญ่",
    dateRange: "วันอาทิตย์ที่ 23 พฤศจิกายน 2568",
    Time: "18.30 น.",
    venue: "สามย่าน มิตรทาวน์ ฮอลล์",
    banner: "/banners/concert/blue-live-in-asia.png",           
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
    id: "passenger-asia-2025-live-in-bangkok",
    title: "(New venue) Passenger Asia 2025 LIVE IN BANGKOK",
    subtitle: "เทศกาลดนตรีสุดยิ่งใหญ่",
    dateRange: "วันศุกร์ที่ 28 พฤศจิกายน 2568",
    Time: "18.00 น. ",
    venue: "Phenix Grand Ballroom ชั้น 5",
    banner: "/banners/concert/passenger-asia-2025-live-in-bangkok.png",           
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
    id: "golden-groove-a-pink-panther-newyear-rewind",
    title: "Golden Groove : A Pink Panther New Year Rewind",
    subtitle: "A Pink Panther New Year Rewind",
    dateRange: "วันเสาร์ที่ 29 พฤศจิกายน 2568",
    Time: "13.00 น.",
    venue: "สมาคมนักเรียนเก่าสหรัฐอเมริกาในพระบรมราชูปถัมภ์ ถ.ราชดำริ",
    banner: "/banners/concert/golden-groove-a-pink-panther-newyear-rewind.png",           
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
    id: "tenblank-from-glass-heart-fan-meeting-asia-tour-in-bangkok-feat-takeru-satoh",
    title: "TENBLANK from ''Glass Heart'' FAN MEETING - ASIA TOUR in Bangkok feat. Takeru Satoh",
    subtitle: "เทศกาลดนตรีสุดยิ่งใหญ่",
    dateRange: "วันเสาร์ที่ 29 พฤศจิกายน 2568",
    Time: "17.00 น.",
    venue: "ยูโอบี ไลฟ์, เอ็มสเฟียร์",
    banner: "/banners/concert/tenblank-from-glass-heart-fan-meeting-asia-tour-in-bangkok-feat-takeru-satoh.jpg",           
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
    id: "faadfest-2026",
    title: "Chang Music Connection presents เทศกาลดนตรีแฝด (FAAD FEST)",
    subtitle: "เทศกาลดนตรีแฝด (FAAD FEST)",
    dateRange: "07 Feb 2026",
    Time: "-",
    venue: "The Ocean, เขาใหญ่",
    banner: "/banners/concert/faad.png",           
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
    id: "till_lindemann_bangkok",
    title: "TILL LINDEMANN MEINE WELT TOUR 2026 3 JAN BANGKOK",
    subtitle: "strict age limit 20+",
    dateRange: "03 January 2026",
    Time: "20:00 PM",
    venue: "UOB LIVE",
    banner: "/banners/concert/Ramstein.png",           
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
    id: "yented",
    title: "Melt Livehouse: YENTED",
    subtitle: "เทศกาลดนตรีสุดยิ่งใหญ่",
    dateRange: "15 November 2025",
    Time: "19:00 PM",
    venue: "Melt Livehouse",
    banner: "/banners/concert/Yented.png",           
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
    id: "MarshallLivehouse",
    title: "Room A Booking - November",
    subtitle: "Nestled in the artistic neighbourhood of Charoenkrung",
    dateRange: "01 - 30 November 2025",
    Time: "22:00 PM",
    venue: "Room A : Size 8 x 4 Meters",
    banner: "/banners/concert/marhmello.png",           
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