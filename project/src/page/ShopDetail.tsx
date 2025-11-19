// src/page/ShopDetail.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";

import { SHOP_PRODUCTS, type ShopProduct } from "../data/shopProducts";

type LoggedInUser = {
  email: string;
};

type CartItem = {
  id: string;
  type: "event" | "product";
  title: string;
  image: string;
  option?: string;
  unitPrice: number;
  quantity: number;
};

// helper รวมสินค้าจาก array หลัก + ที่ admin สร้างไว้ใน localStorage
function getAllProducts(base: ShopProduct[]): ShopProduct[] {
  try {
    const raw = localStorage.getItem("adminProducts");
    if (!raw) return base;

    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return base;

    const fromAdmin: ShopProduct[] = arr.map((p: any) => ({
      id: String(p.id ?? ""),
      name: String(p.name ?? ""),
      subtitle: String(p.subtitle ?? ""),
      banner: String(p.banner ?? ""),
      images: Array.isArray(p.images) ? p.images : [String(p.banner ?? "")],
      category: p.category === "Assessories" ? "Assessories" : "tshirt",
      description: String(p.description ?? ""),
      variants: Array.isArray(p.variants)
        ? p.variants.map((v: any) => ({
            id: String(v.id ?? ""),
            label: String(v.label ?? ""),
            price: Number(v.price ?? 0),
          }))
        : [],
      details: Array.isArray(p.details) ? p.details.map(String) : [],
    }));

    return [...base, ...fromAdmin];
  } catch {
    return base;
  }
}

export default function ShopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const userRaw = localStorage.getItem("loggedInUser");
  const user: LoggedInUser | null = userRaw ? JSON.parse(userRaw) : null;

  // รวม default + admin products
  const allProducts: ShopProduct[] = getAllProducts(SHOP_PRODUCTS);
  const product = allProducts.find((p) => p.id === id);

  // state สำหรับเก็บไซส์ที่เลือก
  const [selectedVariantId, setSelectedVariantId] = useState<
    string | undefined
  >(undefined);

  // ตั้งค่าไซส์เริ่มต้นเป็นตัวแรกของสินค้า
  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product?.id]); // เปลี่ยนสินค้าเมื่อ id เปลี่ยน

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-600">ไม่พบสินค้า</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const variant =
      product.variants.find((v) => v.id === selectedVariantId) ??
      product.variants[0] ??
      null;

    if (!variant) {
      alert("ไม่พบตัวเลือกสินค้า");
      return;
    }

    const cartItem: CartItem = {
      id: `${product.id}:${variant.id}`,
      type: "product",
      title: product.name,
      image: product.banner,
      option: variant.label,
      unitPrice: variant.price,
      quantity: 1,
    };

    const raw = localStorage.getItem("cartItems");
    let items: CartItem[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          items = parsed;
        }
      } catch {
        items = [];
      }
    }

    items.push(cartItem);
    localStorage.setItem("cartItems", JSON.stringify(items));

    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* รูปสินค้า */}
          <div className="w-full md:w-1/3">
            <img
              src={product.banner}
              alt={product.name}
              className="w-full rounded-lg object-cover"
            />
          </div>

          {/* ข้อมูลสินค้า */}
          <div className="flex-1 space-y-3">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-sm text-slate-600">{product.subtitle}</p>
            <p className="text-sm text-slate-700 whitespace-pre-line">
              {product.description}
            </p>

            {/* dropdown เลือกไซส์ */}
            {product.variants.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-slate-900">
                  ตัวเลือกสินค้า
                </p>
                <select
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {product.variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label} — {v.price.toLocaleString()} บาท
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[#234C6A] px-8 py-2.5 text-sm font-semibold text-white hover:bg-[#1b3a4f]"
            >
              เพิ่มลงตะกร้า
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
