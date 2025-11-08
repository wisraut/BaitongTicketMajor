export type PriceTier = {
  name: string;
  price: number;
};

export type Event = {
  id: string;
  title: string;
  subtitle?: string;
  banner: string;
  stageImage: string; 
  description: string;
  prices: PriceTier[];
};

export const EVENTS: Event[] = [
  {
    id: "Red-Hot-Chili-Peppers-Getaway-Album-Asterisk-T-Shirt",
    title: "Red Hot Chili Peppers - Getaway Album Asterisk T-Shirt",
    subtitle: "This is a 100% official licensed short sleeved Red Hot Chili Peppers t-shirt.",
    banner: "/banners/giftshop/RedHotShirt.jpg",           
    stageImage: "/stages/bmmf15.png",      
    description:
      "เงื่อนไขการซื้อบัตร / ช่องทางชำระเงิน / เวลาเปิดประตู / สิ่งที่ควรรู้ก่อนเข้าชม ฯลฯ",
    prices: [
      { name: "Small", price: 1500 },
      { name: "Medium", price: 2000 },
      { name: "Large", price: 2000 },
      { name: "Extra Large", price: 3000 },
      { name: "Double Extra Large", price: 3500 },
    ],
  },
  {
    id: "BLACKPINK-PINK-VENOM-LOGO-T-SHIRT",
    title: "BLACKPINK PINK VENOM LOGO T-SHIRT",
    subtitle: "This is a 100% official licensed short sleeved BLACKPINK - PINK VENOM LOGO T-SHIRT",
    banner: "/banners/giftshop/BLACKPINK-PINKVENOMLOGOT-SHIRT.jpeg",           
    stageImage: "/stages/bmmf15.png",      
    description:
      "เงื่อนไขการซื้อบัตร / ช่องทางชำระเงิน / เวลาเปิดประตู / สิ่งที่ควรรู้ก่อนเข้าชม ฯลฯ",
    prices: [
      { name: "Small", price: 1500 },
      { name: "Medium", price: 2000 },
      { name: "Large", price: 2000 },
      { name: "Extra Large", price: 3000 },
      { name: "Double Extra Large", price: 3500 },
    ],
  },
  {
    id: "My-Chemical-Romance-The-Black-Parade-Cover-T-Shirt",
    title: "My Chemical Romance The Black Parade Cover T-Shirt",
    subtitle: "This is a 100% official licensed short sleeved My Chemical Romance The Black Parade Cover T-Shirt",
    banner: "/banners/giftshop/My-Chemical-Romance-The-Black-Parade-Cover-T-Shirt.jpeg",           
    stageImage: "/stages/bmmf15.png",      
    description:
      "เงื่อนไขการซื้อบัตร / ช่องทางชำระเงิน / เวลาเปิดประตู / สิ่งที่ควรรู้ก่อนเข้าชม ฯลฯ",
    prices: [
      { name: "Small", price: 1500 },
      { name: "Medium", price: 2000 },
      { name: "Large", price: 2000 },
      { name: "Extra Large", price: 3000 },
      { name: "Double Extra Large", price: 3500 },
    ],
  },
];