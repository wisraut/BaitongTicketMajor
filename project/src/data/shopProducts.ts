export type ShopVariant = {
    id: string;
    label: string;
    price: number;
};

export type ShopProduct = {
    id: string;
    name: string;
    subtitle: string;
    banner: string;
    images: string[];
    category: "tshirt" | "Assessories";
    description: string;
    variants: ShopVariant[];
    details: string[];
};

export const SHOP_PRODUCTS: ShopProduct[] = [
    {
    id: "Red-Hot-Chili-Peppers-Getaway-Album-Asterisk-T-Shirt",
    name: "Red Hot Chili Peppers - Getaway Album Asterisk T-Shirt",
    subtitle:
      "This is a 100% official licensed short sleeved Red Hot Chili Peppers t-shirt.",
    banner: "/banners/giftshop/RedHotShirt.jpg",
    images: [
      "/banners/giftshop/RedHotShirt.jpg",
    ],
    category: "tshirt",
    description:
      "เงื่อนไขการซื้อสินค้า / ช่องทางชำระเงิน / สิ่งที่ควรรู้ก่อนสั่งซื้อ ฯลฯ",
    variants: [
      { id: "small", label: "S", price: 1500 },
      { id: "medium", label: "L", price: 2000 },
      { id: "large", label: "XL", price: 2000 },
      { id: "xxl", label: "XXL", price: 3000 },
      { id: "2xl", label: "2XL", price: 3500 },
    ],
    details: [
      "เสื้อยืดคอกลมลิขสิทธิ์แท้",
      "เหมาะสำหรับแฟนเพลง Red Hot Chili Peppers",
    ],
  },
  {
    id: "BLACKPINK-PINK-VENOM-LOGO-T-SHIRT",
    name: "BLACKPINK PINK VENOM LOGO T-SHIRT",
    subtitle:
      "This is a 100% official licensed short sleeved BLACKPINK - PINK VENOM LOGO T-SHIRT",
    banner: "/banners/giftshop/BLACKPINK-PINKVENOMLOGOT-SHIRT.jpeg",
    images: [
      "/banners/giftshop/BLACKPINK-PINKVENOMLOGOT-SHIRT.jpeg",
    ],
    category: "tshirt",
    description:
      "เงื่อนไขการซื้อสินค้า / ช่องทางชำระเงิน / สิ่งที่ควรรู้ก่อนสั่งซื้อ ฯลฯ",
    variants: [
      { id: "small", label: "S", price: 1500 },
      { id: "medium", label: "L", price: 2000 },
      { id: "large", label: "XL", price: 2000 },
      { id: "xl", label: "XXL", price: 3000 },
      { id: "2xl", label: "2XL", price: 3500 },
    ],
    details: [
      "เสื้อยืดลิขสิทธิ์ BLACKPINK",
      "เหมาะสำหรับแฟนเพลงและสายสะสม",
    ],
  },
  {
    id: "My-Chemical-Romance-The-Black-Parade-Cover-T-Shirt",
    name: "My Chemical Romance The Black Parade Cover T-Shirt",
    subtitle:
      "This is a 100% official licensed short sleeved My Chemical Romance The Black Parade Cover T-Shirt",
    banner:
      "/banners/giftshop/My-Chemical-Romance-The-Black-Parade-Cover-T-Shirt.jpeg",
    images: [
      "/banners/giftshop/My-Chemical-Romance-The-Black-Parade-Cover-T-Shirt.jpeg",
    ],
    category: "tshirt",
    description:
      "เงื่อนไขการซื้อสินค้า / ช่องทางชำระเงิน / สิ่งที่ควรรู้ก่อนสั่งซื้อ ฯลฯ",
    variants: [
      { id: "small", label: "S", price: 1500 },
      { id: "medium", label: "L", price: 2000 },
      { id: "large", label: "XL", price: 2000 },
      { id: "xl", label: "XXL", price: 3000 },
      { id: "2xl", label: "2XL", price: 3500 },
    ],
    details: [
      "เสื้อยืดลิขสิทธิ์ My Chemical Romance",
      "เหมาะสำหรับแฟนวงและสะสมเป็นของที่ระลึก",
    ],
  },
  {
    id: "Red-Hot-Chili-Peppers-Getaway-Album-Asterisk-T-Shirt",
    name: "Red Hot Chili Peppers - Getaway Album Asterisk T-Shirt",
    subtitle:
      "This is a 100% official licensed short sleeved Red Hot Chili Peppers t-shirt.",
    banner: "/banners/giftshop/RedHotShirt.jpg",
    images: [
      "/banners/giftshop/RedHotShirt.jpg",
    ],
    category: "tshirt",
    description:
      "เงื่อนไขการซื้อสินค้า / ช่องทางชำระเงิน / สิ่งที่ควรรู้ก่อนสั่งซื้อ ฯลฯ",
    variants: [
      { id: "small", label: "S", price: 1500 },
      { id: "medium", label: "L", price: 2000 },
      { id: "large", label: "XL", price: 2000 },
      { id: "xxl", label: "XXL", price: 3000 },
      { id: "2xl", label: "2XL", price: 3500 },
    ],
    details: [
      "เสื้อยืดคอกลมลิขสิทธิ์แท้",
      "เหมาะสำหรับแฟนเพลง Red Hot Chili Peppers",
    ],
  },
  {
    id: "Red-Hot-Chili-Peppers-Getaway-Album-Asterisk-T-Shirt",
    name: "Red Hot Chili Peppers - Getaway Album Asterisk T-Shirt",
    subtitle:
      "This is a 100% official licensed short sleeved Red Hot Chili Peppers t-shirt.",
    banner: "/banners/giftshop/RedHotShirt.jpg",
    images: [
      "/banners/giftshop/RedHotShirt.jpg",
    ],
    category: "tshirt",
    description:
      "เงื่อนไขการซื้อสินค้า / ช่องทางชำระเงิน / สิ่งที่ควรรู้ก่อนสั่งซื้อ ฯลฯ",
    variants: [
      { id: "small", label: "S", price: 1500 },
      { id: "medium", label: "L", price: 2000 },
      { id: "large", label: "XL", price: 2000 },
      { id: "xxl", label: "XXL", price: 3000 },
      { id: "2xl", label: "2XL", price: 3500 },
    ],
    details: [
      "เสื้อยืดคอกลมลิขสิทธิ์แท้",
      "เหมาะสำหรับแฟนเพลง Red Hot Chili Peppers",
    ],
  },
]

