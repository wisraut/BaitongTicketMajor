import { useEffect, useState } from "react";
import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";
import { useNavigate } from "react-router-dom";

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
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("cartItems");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch (err) {
      console.error("Failed to parse cart items from localStorage", err);
    }
  }, []);

  const syncItems = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem("cartItems", JSON.stringify(next));
  };

  const handleQtyChange = (index: number, quantity: number) => {
    const q = quantity < 1 ? 1 : quantity;
    const next = items.map((item, i) =>
      i === index ? { ...item, quantity: q } : item
    );
    syncItems(next);
  };

  const handleRemove = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    syncItems(next);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-4 text-xl font-bold text-slate-900">
          ตะกร้าของคุณ
        </h1>

        {items.length === 0 ? (
          <p className="text-sm text-slate-600">ยังไม่มีสินค้าในตะกร้า</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id + index}
                  className="flex gap-4 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200"
                >
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-1 text-sm">
                    <div>
                      <p className="line-clamp-2 font-semibold text-slate-900">
                        {item.title}
                      </p>
                      {item.option && (
                        <p className="text-xs text-slate-600">
                          ตัวเลือก: {item.option}
                        </p>
                      )}
                      <p className="text-xs text-slate-500">
                        ประเภท:{" "}
                        {item.type === "event" ? "บัตรงานแสดง" : "สินค้า"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600">จำนวน</span>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            handleQtyChange(
                              index,
                              Number(e.target.value) || 1
                            )
                          }
                          className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-slate-900">
                          {(item.unitPrice * item.quantity).toLocaleString()}{" "}
                          บาท
                        </span>
                        <button
                          onClick={() => handleRemove(index)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 text-sm">
              <h2 className="mb-3 text-base font-semibold text-slate-900">
                สรุปคำสั่งซื้อ
              </h2>
              <div className="flex justify-between">
                <span>ยอดรวม</span>
                <span>{subtotal.toLocaleString()} บาท</span>
              </div>
              <div className="mt-4 border-t border-slate-200 pt-3 flex justify-between font-semibold">
                <span>ยอดชำระทั้งหมด</span>
                <span>{subtotal.toLocaleString()} บาท</span>
              </div>
              <button
                disabled={items.length === 0}
                onClick={() => navigate("/checkout")}
                className="mt-4 w-full rounded-lg bg-[#234C6A] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-400"
              >
                ดำเนินการชำระเงิน
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
