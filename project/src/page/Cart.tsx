// src/page/Cart.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";

type CartItem = {
  id: string;
  type: "event" | "product";
  title: string;
  image: string;
  option?: string;
  unitPrice: number;
  quantity: number;
};

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("cartItems");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch {
      setItems([]);
    }
  }, []);

  const updateAndSave = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem("cartItems", JSON.stringify(next));
  };

  const handleChangeQty = (id: string, quantity: number) => {
    if (quantity <= 0) return;
    const next = items.map((it) => (it.id === id ? { ...it, quantity } : it));
    updateAndSave(next);
  };

  const handleRemove = (id: string) => {
    const next = items.filter((it) => it.id !== id);
    updateAndSave(next);
  };

  const handleClear = () => {
    updateAndSave([]);
  };

  const total = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);

  const handleGoPayment = () => {
    if (items.length === 0) return;
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">ตะกร้าสินค้า</h1>

        {items.length === 0 ? (
          <p className="text-sm text-slate-600">ยังไม่มีสินค้าในตะกร้า</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
                >
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </p>
                    {item.option && (
                      <p className="text-xs text-slate-600">
                        ตัวเลือก: {item.option}
                      </p>
                    )}
                    <p className="text-xs text-slate-500">
                      ประเภท: {item.type === "event" ? "งานแสดง" : "สินค้า"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {item.unitPrice.toLocaleString()} บาท
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          handleChangeQty(item.id, Number(e.target.value) || 1)
                        }
                        className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="text-xs text-red-600"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-600 underline"
              >
                ล้างตะกร้าทั้งหมด
              </button>
            </div>

            <aside className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 space-y-3">
              <h2 className="text-sm font-semibold text-slate-900">
                สรุปรายการ
              </h2>
              <div className="flex justify-between text-sm text-slate-700">
                <span>ยอดรวม</span>
                <span>{total.toLocaleString()} บาท</span>
              </div>
              <button
                type="button"
                onClick={handleGoPayment}
                className="mt-2 w-full rounded-full bg-[#234C6A] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-400"
                disabled={items.length === 0}
              >
                ไปหน้าชำระเงิน
              </button>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
