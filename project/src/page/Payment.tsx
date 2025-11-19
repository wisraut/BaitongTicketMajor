// src/page/Payment.tsx
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
  eventdate?: string;
  eventlocation?: string;
  eventtime?: string;
};

type OrderHistoryItem = {
  id: string;
  email: string;
  type: "event" | "product" | "mixed";
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  buyerName?: string;
  contactEmail?: string;
  phone?: string;
  paymentMethod?: string;
};

type LoggedInUser = {
  name?: string;
  email?: string;
  uid?: string;
};

const HISTORY_KEY = "orderHistory";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  // โหลดตะกร้า
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

  const total = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("ยังไม่มีรายการในตะกร้า");
      return;
    }
    if (!name || !email || !phone) {
      alert("กรุณากรอกชื่อ อีเมล และเบอร์โทรให้ครบ");
      return;
    }

    // อ่านข้อมูล user ที่ล็อกอิน (ถ้ามี)
    let loggedEmail = "";
    try {
      const rawUser = localStorage.getItem("loggedInUser");
      if (rawUser) {
        const parsed = JSON.parse(rawUser) as LoggedInUser;
        if (parsed.email) loggedEmail = parsed.email.toLowerCase();
      }
    } catch {
      loggedEmail = "";
    }

    // หา type ของออเดอร์ (event / product / mixed)
    const types = new Set(items.map((i) => i.type));
    let orderType: OrderHistoryItem["type"];
    if (types.size === 1) {
      orderType = types.has("event") ? "event" : "product";
    } else {
      orderType = "mixed";
    }

    const now = new Date();

    const newOrder: OrderHistoryItem = {
      id: `ORD-${now.getTime()}`, // ไอดีออเดอร์ง่ายๆ จาก timestamp
      email: (loggedEmail || email).toLowerCase(),
      type: orderType,
      items,
      totalAmount: total,
      createdAt: now.toISOString(),
      buyerName: name,
      contactEmail: email,
      phone,
      paymentMethod: "QR Payment",
    };

    // ดึง history เดิมจาก localStorage
    let history: OrderHistoryItem[] = [];
    const rawHistory = localStorage.getItem(HISTORY_KEY);
    if (rawHistory) {
      try {
        const parsed = JSON.parse(rawHistory);
        if (Array.isArray(parsed)) history = parsed;
      } catch {
        history = [];
      }
    }

    history.push(newOrder);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    alert("ชำระเงินสำเร็จ ขอบคุณที่ใช้บริการ BaiTongTicket");

    // เคลียร์ตะกร้า แล้วไปหน้า history
    localStorage.removeItem("cartItems");
    navigate("/history");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">ชำระเงิน</h1>

        {items.length === 0 ? (
          <p className="text-sm text-slate-600">
            ยังไม่มีรายการในตะกร้า กรุณาเลือกงานแสดงหรือสินค้าเพิ่มลงตะกร้าก่อน
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
            {/* ฟอร์มข้อมูลผู้ซื้อ */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                ข้อมูลผู้ซื้อ
              </h2>

              <div>
                <label className="block text-xs font-medium mb-1">
                  ชื่อ-นามสกุล
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  หมายเหตุ (ไม่บังคับ)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-[#234C6A] px-6 py-2.5 text-sm font-semibold text-white"
              >
                ยืนยันการชำระเงิน
              </button>
            </form>

            {/* สรุปรายการ + QR */}
            <aside className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 space-y-4">
              <h2 className="text-sm font-semibold text-slate-900">
                สรุปรายการ
              </h2>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-xs text-slate-700"
                  >
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      {item.option && (
                        <p className="text-slate-500">
                          ตัวเลือก: {item.option}
                        </p>
                      )}
                      <p className="text-slate-500">x{item.quantity} ชิ้น</p>
                    </div>
                    <p className="font-semibold">
                      {(item.unitPrice * item.quantity).toLocaleString()} บาท
                    </p>
                  </div>
                ))}
              </div>

              <hr className="my-2" />

              <div className="flex justify-between text-sm font-semibold text-slate-900">
                <span>ยอดรวมทั้งหมด</span>
                <span>{total.toLocaleString()} บาท</span>
              </div>

              <div className="mt-6 flex justify-center">
                <img
                  src="/qrcode.jpg"
                  alt="QR Code สำหรับชำระเงิน"
                  className="w-64 h-64 object-contain"
                />
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
