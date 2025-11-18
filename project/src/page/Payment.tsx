// src/page/Payment.tsx
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";

import { EVENTS as CONCERT_EVENTS } from "../data/eventconcert";
import { EVENTS as BOXING_EVENTS } from "../data/eventboxing";
import { EVENTS as PERFORMANCE_EVENTS } from "../data/eventperformance";

import QRCodePopup from "../payment/qrcode";

// ---- ชนิดข้อมูลพื้นฐานสำหรับ Event ----
interface BasePrice {
  name: string;
  price: number;
}

interface BaseEvent {
  id: string;
  title: string;
  banner: string;
  prices: BasePrice[];
  dateRange?: string;
  venue?: string;
  Time?: string;
}

// รวมทุก EVENT แล้วอิงเป็น BaseEvent เพื่อหลีกเลี่ยง any
const ALL_EVENTS: BaseEvent[] = [
  ...CONCERT_EVENTS,
  ...BOXING_EVENTS,
  ...PERFORMANCE_EVENTS,
] as BaseEvent[];

type EventDetail = BaseEvent;
type PriceTier = BasePrice;

// ---------------- Component หลัก ----------------
export default function PaymentPage() {
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventDetail | null>(null);

  const [selectedTierName, setSelectedTierName] = useState<string>("");
  const [qty, setQty] = useState<number>(1);

  // ข้อมูลผู้ซื้อ
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // วิธีชำระเงิน
  const [paymentMethod, setPaymentMethod] = useState<
    "mobile" | "card" | "onsite"
  >("mobile");

  // error / popup
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  // โหลดงานจาก currentEventId ใน localStorage
  useEffect(() => {
    const storedId = localStorage.getItem("currentEventId");
    if (!storedId) {
      navigate("/events");
      return;
    }

    const found = ALL_EVENTS.find((ev) => ev.id === storedId);
    if (!found) {
      navigate("/events");
      return;
    }
    setEvent(found);
  }, [navigate]);

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-600">กำลังโหลดข้อมูลงานแสดง...</p>
      </div>
    );
  }

  const selectedTier: PriceTier | undefined = event.prices.find(
    (p) => p.name === selectedTierName
  );

  const totalAmount =
    selectedTier && qty > 0 ? selectedTier.price * qty : 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // 1) เช็กข้อมูลผู้ซื้อ
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      alert("กรุณากรอกชื่อ อีเมล และเบอร์โทรศัพท์ให้ครบ");
      return;
    }

    // 2) เช็กว่าอีเมลต้องมี '@'
    if (!email.includes("@")) {
      alert("กรุณากรอกอีเมลให้ถูกต้อง (ต้องมีเครื่องหมาย @)");
      return;
    }

    // 3) เช็กโซนที่นั่ง / จำนวนบัตร
    if (!selectedTier) {
      alert("กรุณาเลือกโซนที่นั่ง");
      return;
    }

    if (qty <= 0) {
      alert("จำนวนบัตรต้องมากกว่า 0");
      return;
    }

    setErrorMessage(null);

    const methodLabel =
      paymentMethod === "mobile"
        ? "โอนผ่าน Mobile Banking"
        : paymentMethod === "card"
        ? "บัตรเครดิต / เดบิต"
        : "จ่ายปลายทางที่หน้างาน";

    // แจ้งเตือนก่อนเปิด QR
    alert(
      [
        "ชำระเงินสำเร็จ ขอบคุณที่ใช้บริการ BaiTongTicket",
        "",
        `ชื่อผู้ซื้อ: ${fullName}`,
        `อีเมล: ${email}`,
        `เบอร์โทรศัพท์: ${phone}`,
        `วิธีชำระเงิน: ${methodLabel}`,
      ].join("\n")
    );

    // 4) เปิด popup QR ตามยอดเงินที่คำนวณแล้ว
    setShowQR(true);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="grid gap-6 md:grid-cols-[3fr,2fr]"
        >
          {/* ซ้าย: การ์ดงาน + ฟอร์มผู้ซื้อ */}
          <div className="space-y-4">
            {/* การ์ดงาน */}
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 flex gap-4">
              {event.banner && (
                <img
                  src={event.banner}
                  alt={event.title}
                  className="hidden sm:block h-24 w-24 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 text-sm space-y-1">
                <p className="text-xs uppercase text-slate-400">
                  {event.id}
                </p>
                <p className="font-semibold text-slate-900">
                  {event.title}
                </p>
                {event.dateRange && (
                  <p className="text-slate-600">
                    วันจัดงาน {event.dateRange}
                  </p>
                )}
                {event.venue && (
                  <p className="text-slate-600">
                    สถานที่จัดงาน {event.venue}
                  </p>
                )}
              </div>
            </div>

            {/* ฟอร์มข้อมูลผู้ซื้อ */}
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 space-y-3 text-sm">
              <h2 className="font-semibold text-slate-900">
                ข้อมูลผู้ซื้อ
              </h2>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs text-slate-700">
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
                  <label className="block text-xs text-slate-700">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#234C6A] focus:outline-none focus:ring-1 focus:ring-[#234C6A]"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs text-slate-700">
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

              {/* โซนที่นั่ง + จำนวนบัตร */}
              <div className="mt-2 space-y-3">
                <p className="text-sm font-semibold text-slate-900">
                  เลือกที่นั่งและจำนวนบัตร
                </p>

                <div className="grid gap-3 md:grid-cols-[2fr,1fr] items-end">
                  <div className="space-y-1">
                    <label className="block text-xs text-slate-700">
                      โซนที่นั่ง
                    </label>
                    <select
                      value={selectedTierName}
                      onChange={(e) => setSelectedTierName(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#234C6A] focus:outline-none focus:ring-1 focus:ring-[#234C6A]"
                    >
                      <option value="">เลือกโซนที่นั่ง</option>
                      {event.prices.map((tier) => (
                        <option key={tier.name} value={tier.name}>
                          {tier.name} ราคา {tier.price.toLocaleString()} บาท
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs text-slate-700">
                      จำนวนบัตร
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) =>
                        setQty(Math.max(1, Number(e.target.value) || 1))
                      }
                      className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#234C6A] focus:outline-none focus:ring-1 focus:ring-[#234C6A]"
                    />
                  </div>
                </div>
              </div>

              {/* วิธีชำระเงิน */}
              <div className="mt-3 space-y-2">
                <p className="text-sm font-semibold text-slate-900">
                  วิธีชำระเงิน
                </p>
                <div className="space-y-1 text-sm text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payMethod"
                      className="h-4 w-4"
                      checked={paymentMethod === "mobile"}
                      onChange={() => setPaymentMethod("mobile")}
                    />
                    โอนผ่าน Mobile Banking
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payMethod"
                      className="h-4 w-4"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    บัตรเครดิต / เดบิต
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payMethod"
                      className="h-4 w-4"
                      checked={paymentMethod === "onsite"}
                      onChange={() => setPaymentMethod("onsite")}
                    />
                    จ่ายปลายทางที่หน้างาน (ถ้ารองรับ)
                  </label>
                </div>
              </div>

              {errorMessage && (
                <p className="text-xs text-red-500">{errorMessage}</p>
              )}
            </div>
          </div>

          {/* ขวา: สรุปคำสั่งซื้อ */}
          <aside className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 text-sm space-y-3">
            <h2 className="font-semibold text-slate-900">
              สรุปคำสั่งซื้อ
            </h2>

            <div className="rounded-lg border border-slate-200 p-3 flex gap-3">
              {event.banner && (
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                  <img
                    src={event.banner}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 text-xs space-y-0.5">
                <p className="font-semibold text-slate-900">
                  {event.title}
                </p>
                {selectedTier && (
                  <p className="text-slate-700">
                    โซนที่นั่ง: {selectedTier.name}
                  </p>
                )}
                <p className="text-slate-700">จำนวน {qty} ใบ</p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>ราคาต่อใบ</span>
                <span>
                  {selectedTier
                    ? selectedTier.price.toLocaleString()
                    : 0}{" "}
                  บาท
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>ยอดชำระรวม</span>
                <span>{totalAmount.toLocaleString()} บาท</span>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <button
                type="submit"
                className="w-full rounded-lg bg-[#234C6A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1c3f55]"
              >
                ยืนยันการชำระเงิน
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                กลับไปหน้าก่อนหน้า
              </button>
            </div>
          </aside>
        </form>
      </main>

      <Footer />

      {/* Popup QR – เปิดเฉพาะเมื่อ validate ผ่านและกด OK จาก alert แล้ว */}
      {showQR && selectedTier && (
        <QRCodePopup amount={totalAmount} onClose={() => setShowQR(false)} />
      )}
    </div>
  );
}
