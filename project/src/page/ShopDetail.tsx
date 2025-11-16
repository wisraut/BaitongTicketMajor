import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";

import { SHOP_PRODUCTS } from "../data/shopProducts";
import type { ShopProduct, ShopVariant } from "../data/shopProducts";

type CartItem = {
  id: string;
  type: "event" | "product";
  title: string;
  image: string;
  option?: string;
  unitPrice: number;
  quantity: number;
};

export default function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product: ShopProduct | undefined = SHOP_PRODUCTS.find(
    (p) => p.id === id
  );

  const [activeImage, setActiveImage] = useState<string | null>(
    product && product.images.length > 0 ? product.images[0] : null
  );
  const [selectedVariant, setSelectedVariant] = useState<ShopVariant | null>(
    product && product.variants.length > 0 ? product.variants[0] : null
  );
  const [qty, setQty] = useState<number>(1);

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
    if (!selectedVariant) return;

    const cartItem: CartItem = {
      id: `${product.id}:${selectedVariant.id}`,
      type: "product",
      title: product.name,
      image: activeImage ?? product.banner,
      option: selectedVariant.label,
      unitPrice: selectedVariant.price,
      quantity: qty,
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

  const total = selectedVariant ? selectedVariant.price * qty : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="w-full rounded-xl bg-white shadow-sm ring-1 ring-slate-200 p-3">
                {activeImage && (
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="w-full h-80 md:h-96 object-contain rounded-lg bg-slate-50"
                  />
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {product.images.map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`h-16 w-16 flex-shrink-0 rounded-lg border ${
                        activeImage === img
                          ? "border-[#234C6A]"
                          : "border-slate-200"
                      } overflow-hidden bg-white`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  สินค้า
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900">
                  {product.name}
                </h1>
                {product.subtitle && (
                  <p className="mt-1 text-sm text-slate-600">
                    {product.subtitle}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800">
                  ตัวเลือกสินค้า
                </p>
                <select
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={selectedVariant?.id ?? ""}
                  onChange={(e) => {
                    const found = product.variants.find(
                      (v) => v.id === e.target.value
                    );
                    setSelectedVariant(found ?? null);
                  }}
                >
                  {product.variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label} ราคา {v.price.toLocaleString()} บาท
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800">
                  จำนวน
                </p>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>ราคาต่อชิ้น</span>
                  <span>
                    {selectedVariant
                      ? selectedVariant.price.toLocaleString()
                      : 0}{" "}
                    บาท
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>ยอดรวม</span>
                  <span>{total.toLocaleString()} บาท</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full rounded-full bg-[#234C6A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1c3f55]"
                >
                  เพิ่มลงตะกร้า
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  กลับไปหน้าก่อนหน้า
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
            <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 text-sm leading-relaxed text-slate-800">
              <h2 className="text-base font-semibold text-slate-900 mb-2">
                รายละเอียดสินค้า
              </h2>
              <p>{product.description}</p>
            </div>

            {product.details && product.details.length > 0 && (
              <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 text-sm text-slate-800">
                <h2 className="text-base font-semibold text-slate-900 mb-2">
                  ข้อมูลเพิ่มเติม
                </h2>
                <ul className="list-disc list-inside space-y-1">
                  {product.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
