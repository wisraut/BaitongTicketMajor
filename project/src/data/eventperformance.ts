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
  Time?: string;
  stageImage: string;
  venue: string;
  description: string;
  prices: PriceTier[];
};

export const EVENTS: Event[] = [
  {
    id: "whc-booktroverts",
    title: "theWHOLESOME Hobbies Club: Booktroverts Series hosted by Read Me Again x theCOMMONS",
    subtitle: "No age restriction",
    dateRange: "18 - 20 January 2025",
    Time: "14:00  PM",
    venue: "theCOMMONS Thonglor",
    banner: "/banners/performance/booktroverts.jpg",
    stageImage: "/stages/bmmf15.png",
    description:
      "เงื่อนไขในการซื้อตั๋ว / ช่องทางชำระเงิน / เวลาเปิดประตู / สิ่งที่ควรรู้ก่อนเข้าชม ฯลฯ",
    prices: [
      { name: "FREE ACCESS", price: 0 },
    ],
  },
  {
    id: "collectionhorrorhouse",
    title: "JUNJI ITO COLLECTION HORROR HOUSE",
    subtitle: "Children under 100 cm in height are strictly not allowed. Children between 101 cm – 120 cm must be accompanied by a guardian at all times.",
    dateRange: "MBK CENTER, Fl.4 Zone A",
    Time: "11:00  AM",
    venue: "MBK Center, 4th Floor, Zone A",
    banner: "/banners/performance/junji.png",
    stageImage: "/stages/bmmf15.png",
    description:
      "เงื่อนไขในการซื้อตั๋ว / ช่องทางชำระเงิน / เวลาเปิดประตู / สิ่งที่ควรรู้ก่อนเข้าชม ฯลฯ",
    prices: [
      { name: "FREE ACCESS", price: 0 },
    ],
  },
  {
    id: "whc-tai-chi-club",
    title: "theWHOLESOME Tai Chi Club",
    subtitle: "No age restriction",
    dateRange: "01 March 2025",
    Time: "13:30 PM",
    venue: "theCOMMONS Thonglor",
    banner: "/banners/performance/thaichi.jpg",
    stageImage: "/stages/bmmf15.png",
    description:
      "เงื่อนไขในการซื้อตั๋ว / ช่องทางชำระเงิน / เวลาเปิดประตู / สิ่งที่ควรรู้ก่อนเข้าชม ฯลฯ",
    prices: [
      { name: "FREE ACCESS", price: 0 },
    ],
  },
  {
    id: "haphow-the-musical",
    title: "HAPHOW The Musical",
    subtitle: "Must be 3 +",
    dateRange: "24 October 2025",
    Time: "10:30   AM",
    venue: "The Theatre at Solaire, Parañaque City",
    banner: "/banners/performance/haphow.png",
    stageImage: "/stages/bmmf15.png",
    description:
      "เงื่อนไขในการซื้อตั๋ว / ช่องทางชำระเงิน / เวลาเปิดประตู / สิ่งที่ควรรู้ก่อนเข้าชม ฯลฯ",
    prices: [
      { name: "FREE ACCESS", price: 0 },
    ],
  },{
    id: "mysticuniverse360",
    title: "MYSTIC UNIVERSE: A JOURNEY BEYOND IMAGINATION",
    subtitle: "No age restriction",
    dateRange: "-",
    Time: "13:30 PM",
    venue: "360Art Center",
    banner: "/banners/performance/360dome.png",
    stageImage: "/stages/bmmf15.png",
    description:
      "เงื่อนไขในการซื้อตั๋ว / ช่องทางชำระเงิน / เวลาเปิดประตู / สิ่งที่ควรรู้ก่อนเข้าชม ฯลฯ",
    prices: [
      { name: "FREE ACCESS", price: 0 },
    ],
  },{
    id: "snoopy",
    title: "How Do You Do, Snoopy? 75 Years: A Journey of Friendship Through Art",
    subtitle: "No age restriction",
    dateRange: "6 - 7 September 2025",
    Time: "20:00 PM",
    venue: "ริเวอร์ ซิตี้ แบงค็อก",
    banner: "/banners/performance/snoopy.png",
    stageImage: "/stages/bmmf15.png",
    description:
      "เงื่อนไขในการซื้อตั๋ว / ช่องทางชำระเงิน / เวลาเปิดประตู / สิ่งที่ควรรู้ก่อนเข้าชม ฯลฯ",
    prices: [
      { name: "FREE ACCESS", price: 0 },
    ],
  },
];
