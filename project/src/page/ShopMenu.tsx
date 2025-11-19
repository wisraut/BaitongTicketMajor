// src/page/ShopMenu.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";

import { SHOP_PRODUCTS, type ShopProduct } from "../data/shopProducts";
import { getAllProducts } from "../utils/localData";

export default function ShopMenuPage() {
  const [products, setProducts] = useState<ShopProduct[]>([]);

  useEffect(() => {
    // รวมสินค้า default + ที่ admin เพิ่มจาก localStorage (ถ้า utils ทำแบบนี้)
    const merged = getAllProducts(SHOP_PRODUCTS);
    setProducts(merged);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">GiftShop</h1>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/shop/${p.id}`}
              className="block rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="w-full aspect-[3/4] overflow-hidden bg-slate-100">
                <img
                  src={p.banner}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4 space-y-1">
                <h2 className="text-sm font-semibold line-clamp-2">{p.name}</h2>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {p.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
