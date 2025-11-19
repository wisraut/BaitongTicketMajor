import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";
import QRCodePopup from "../components/shop/qrcode";

type CartItem = {
  id: string;
  type: "event" | "product";
  title: string;
  image: string;
  option?: string;
  unitPrice: number;
  quantity: number;
  eventDate?: string;
  eventVenue?: string;
};

// โครง CartItem ที่จะเก็บใน orderHistory (ให้ตรงกับ History / Payment)
type HistoryCartItem = {
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
  items: HistoryCartItem[];
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

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<"mobile" | "card" | "onsite">("mobile");

  const [showQR, setShowQR] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);

  const navigate = useNavigate();

  // โหลด cart จาก localStorage
  useEffect(() => {
    const raw = localStorage.getItem("cartItems");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as CartItem[];
      if (Array.isArray(parsed)) setItems(parsed);
    } catch (err) {
      console.error("Failed to parse cart items from localStorage", err);
    }
  }, []);

  // โหลด loggedInUser เพื่อ prefill และใช้ email จริงตอนบันทึก history
  useEffect(() => {
    const rawUser = localStorage.getItem("loggedInUser");
    if (!rawUser) return;

    try {
      const parsed = JSON.parse(rawUser) as LoggedInUser;
      setLoggedInUser(parsed);

      if (parsed.email && !email) {
        setEmail(parsed.email);
      }
      if (parsed.name && !fullName) {
        setFullName(parsed.name);
      }
    } catch {
      setLoggedInUser(null);
    }
    // ไม่อยากให้ effect ยิงซ้ำเวลาพิมพ์ email/fullName เลยไม่ใส่เป็น dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("ยังไม่มีสินค้าในตะกร้า");
      return;
    }

    if (!fullName || !email || !phone) {
      alert("กรุณากรอกชื่อ, อีเมล และเบอร์โทรศัพท์ให้ครบ");
      return;
    }

    // บังคับว่าต้องมี @ ในอีเมล
    if (!email.includes("@")) {
      alert("กรุณากรอกอีเมลให้ถูกต้อง (ต้องมีเครื่องหมาย @)");
      return;
    }

    // ผ่าน validation แล้วค่อยเปิด QR (ยังไม่บันทึก history จนกดชำระเงินแล้ว)
    setShowQR(true);
  };

  const getPaymentMethodText = () => {
    if (paymentMethod === "mobile") return "โอนผ่าน Mobile Banking";
    if (paymentMethod === "card") return "บัตรเครดิต / เดบิต";
    return "จ่ายปลายทางที่หน้างาน";
  };

  // ฟังก์ชันนี้จะถูกเรียกตอนกด "ชำระเงินแล้ว" บน popup QR
  const handlePaidFromQR = () => {
    // ----- โหลด history เดิมจาก orderHistory -----
    const rawHistory = localStorage.getItem(HISTORY_KEY);
    let history: OrderHistoryItem[] = [];
    if (rawHistory) {
      try {
        const parsed = JSON.parse(rawHistory) as OrderHistoryItem[];
        if (Array.isArray(parsed)) history = parsed;
      } catch {
        history = [];
      }
    }

    // ใช้ email จาก loggedInUser เป็นหลัก ถ้ามี
    let loginEmail = email.trim();
    if (loggedInUser?.email) {
      loginEmail = loggedInUser.email;
    }

    // map CartItem เป็น HistoryCartItem
    const historyItems: HistoryCartItem[] = items.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      image: item.image,
      option: item.option,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      eventdate: item.eventDate,
      eventlocation: item.eventVenue,
      eventtime: undefined,
    }));

    // หาประเภทของ order: event / product / mixed
    const hasEvent = historyItems.some((i) => i.type === "event");
    const hasProduct = historyItems.some((i) => i.type === "product");
    let orderType: "event" | "product" | "mixed" = "event";
    if (hasEvent && hasProduct) orderType = "mixed";
    else if (!hasEvent && hasProduct) orderType = "product";

    const newOrder: OrderHistoryItem = {
      id: `ORD-${Date.now()}`,
      email: loginEmail,
      type: orderType,
      items: historyItems,
      totalAmount: subtotal,
      createdAt: new Date().toISOString(),
      buyerName: fullName.trim(),
      contactEmail: email.trim(),
      phone: phone.trim(),
      paymentMethod: getPaymentMethodText(),
    };

    const merged = [...history, newOrder];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(merged));

    // ล้าง cart
    localStorage.removeItem("cartItems");
    setItems([]);

    setShowQR(false);
    navigate("/"); // กลับหน้า Home
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-xl font-bold text-slate-900">ชำระเงิน</h1>

        {items.length === 0 ? (
          <p className="text-sm text-slate-600">
            ยังไม่มีสินค้าในตะกร้า กรุณาเลือกสินค้าหรือบัตรจากหน้าอื่นก่อน
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
            {/* ฟอร์มผู้ซื้อ */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
            >
              <h2 className="text-base font-semibold text-slate-900">
                ข้อมูลผู้ซื้อ
              </h2>

              <div className="space-y-1">
                <label className="block text-sm text-slate-700">
                  ชื่อและนามสกุล
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#234C6A] focus:outline-none focus:ring-1 focus:ring-[#234C6A]"
                  placeholder="เช่น สมชาย ใจดี"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm text-slate-700">อีเมล</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#234C6A] focus:outline-none focus:ring-1 focus:ring-[#234C6A]"
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm text-slate-700">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#234C6A] focus:outline-none focus:ring-1 focus:ring-[#234C6A]"
                  placeholder="เช่น 0812345678"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm text-slate-700">
                  ที่อยู่สำหรับออกใบเสร็จ (ไม่บังคับ)
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#234C6A] focus:outline-none focus:ring-1 focus:ring-[#234C6A]"
                  placeholder="ใส่ที่อยู่ถ้าต้องการใบเสร็จเต็มรูปแบบ"
                />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  วิธีชำระเงิน
                </p>
                <div className="space-y-2 text-sm text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pay"
                      className="h-4 w-4"
                      checked={paymentMethod === "mobile"}
                      onChange={() => setPaymentMethod("mobile")}
                    />
                    โอนผ่าน Mobile Banking
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pay"
                      className="h-4 w-4"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    บัตรเครดิต / เดบิต
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pay"
                      className="h-4 w-4"
                      checked={paymentMethod === "onsite"}
                      onChange={() => setPaymentMethod("onsite")}
                    />
                    จ่ายปลายทางที่หน้างาน (สำหรับบัตรงานแสดงที่รองรับ)
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-[#234C6A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1c3f55]"
              >
                ยืนยันการชำระเงิน
              </button>
            </form>

            {/* สรุปรายการ */}
            <aside className="space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 text-sm">
              <h2 className="text-base font-semibold text-slate-900">
                สรุปรายการในตะกร้า
              </h2>

              <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-lg border border-slate-200 p-2"
                  >
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="line-clamp-2 text-[13px] font-medium text-slate-900">
                        {item.title}
                      </p>
                      {item.option && (
                        <p className="text-[12px] text-slate-600">
                          ตัวเลือก: {item.option}
                        </p>
                      )}
                      {item.eventDate && (
                        <p className="text-[12px] text-slate-600">
                          วันที่แสดง: {item.eventDate}
                        </p>
                      )}
                      {item.eventVenue && (
                        <p className="text-[12px] text-slate-600">
                          สถานที่: {item.eventVenue}
                        </p>
                      )}
                      <p className="text-[12px] text-slate-500">
                        จำนวน {item.quantity} ใบ
                      </p>
                      <p className="text-[12px] font-semibold text-slate-900">
                        {(item.unitPrice * item.quantity).toLocaleString()} บาท
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between font-semibold">
                <span>ยอดชำระรวม</span>
                <span>{subtotal.toLocaleString()} บาท</span>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />

      {showQR && (
        <QRCodePopup
          amount={subtotal}
          onClose={() => setShowQR(false)}
          onPaid={handlePaidFromQR}
        />
      )}
    </div>
  );
}
