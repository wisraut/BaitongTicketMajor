import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/base/Header";
import Footer from "../components/base/Footer";

import {
  EVENTS as CONCERT_EVENTS,
  type Event as ConcertEvent,
} from "../data/eventconcert";
import {
  EVENTS as BOXING_EVENTS,
  type Event as BoxingEvent,
} from "../data/eventboxing";
import {
  EVENTS as PERFORMANCE_EVENTS,
  type Event as PerformanceEvent,
} from "../data/eventperformance";

import Qrcode from "../components/shop/qrcode";

type EventDetail = ConcertEvent | BoxingEvent | PerformanceEvent;
type PriceTier = EventDetail["prices"][number];

const ALL_EVENTS: EventDetail[] = [
  ...CONCERT_EVENTS,
  ...BOXING_EVENTS,
  ...PERFORMANCE_EVENTS,
];

type PaymentMethod = "mobile" | "card" | "onsite";

// โครง CartItem กลาง ใช้ร่วมกับระบบ cart/history อื่น ๆ ได้
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

// โครง OrderHistory กลาง ตาม requirement ใหม่
type OrderHistoryItem = {
  id: string;
  email: string; // email เจ้าของ order (ใช้ filter ในหน้า History)
  type: "event" | "product" | "mixed";
  items: CartItem[];
  totalAmount: number;
  createdAt: string;

  // ข้อมูลเสริม ไว้โชว์เพิ่มได้ภายหลัง
  buyerName?: string;
  contactEmail?: string;
  phone?: string;
  paymentMethod?: string;
};

const HISTORY_KEY = "orderHistory";

const getPaymentMethodLabel = (method: PaymentMethod): string => {
  if (method === "mobile") return "โอนผ่าน Mobile Banking";
  if (method === "card") return "บัตรเครดิต / เดบิต";
  return "จ่ายปลายทางที่หน้างาน";
};

export default function Payment() {
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [selectedTier, setSelectedTier] = useState<PriceTier | null>(null);
  const [ticketQty, setTicketQty] = useState<number>(1);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("mobile");

  const [showQR, setShowQR] = useState(false);

  // โหลดอีเวนต์จาก localStorage ที่เซ็ตจากหน้า EventDetail + prefill email จาก loggedInUser ถ้ามี
  useEffect(() => {
    const storedId = localStorage.getItem("currentEventId");
    if (!storedId) {
      navigate("/");
      return;
    }

    const found = ALL_EVENTS.find((ev) => ev.id === storedId) ?? null;
    if (!found) {
      navigate("/");
      return;
    }

    setEvent(found);
    const firstTier = found.prices[0] as PriceTier | undefined;
    setSelectedTier(firstTier ?? null);

    // พยายามดึง email จากผู้ใช้ที่ login
    const rawUser = localStorage.getItem("loggedInUser");
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser) as { email?: string; name?: string };
        if (parsed.email) {
          setEmail(parsed.email);
        }
        if (parsed.name) {
          setFullName((prev) => (prev ? prev : parsed.name ?? ""));
        }
      } catch {
        // ถ้า parse ไม่ได้ ก็ไม่ต้องทำอะไร
      }
    }
  }, [navigate]);

  if (!event || !selectedTier) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-500">กำลังโหลดรายละเอียดงาน…</p>
      </div>
    );
  }

  const totalAmount = selectedTier.price * ticketQty;

  const handleConfirmPayment = () => {
    // validate ฟิลด์บังคับ
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      alert("กรุณากรอกชื่อ อีเมล และเบอร์โทรศัพท์ให้ครบ");
      return;
    }

    if (!email.includes("@")) {
      alert("กรุณากรอกอีเมลให้ถูกต้อง (ต้องมีเครื่องหมาย @)");
      return;
    }

    if (ticketQty <= 0) {
      alert("จำนวนบัตรต้องมากกว่า 0");
      return;
    }

    // ผ่าน validation แล้วค่อยเปิด popup QR (จำลองการชำระเงิน)
    setShowQR(true);
  };

  // ผู้ใช้กด "ชำระเงินแล้ว" ในหน้าต่าง QR
  const handlePaidFromQR = () => {
    // ใช้ email จาก loggedInUser เป็นหลัก ถ้ามี
    const rawUser = localStorage.getItem("loggedInUser");
    let loginEmail = email.trim();

    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser) as { email?: string };
        if (parsed.email) {
          loginEmail = parsed.email;
        }
      } catch {
        // ถ้า parse ไม่ได้ ก็ใช้ email จากฟอร์มต่อไป
      }
    }

    // อ่าน history เดิม
    const historyRaw = localStorage.getItem(HISTORY_KEY);
    let history: OrderHistoryItem[] = [];

    if (historyRaw) {
      try {
        const parsed = JSON.parse(historyRaw);
        if (Array.isArray(parsed)) {
          history = parsed as OrderHistoryItem[];
        }
      } catch {
        history = [];
      }
    }

    // แปลง event นี้เป็น CartItem 1 ชิ้น
    const paidItem: CartItem = {
      id: `${event.id}-${selectedTier.name}`,
      type: "event",
      title: event.title,
      image: event.banner,
      option: selectedTier.name,
      unitPrice: selectedTier.price,
      quantity: ticketQty,
      eventdate: event.dateRange ?? "",
      eventlocation: event.venue ?? "",
      eventtime: event.Time ?? "",
    };

    // สร้าง OrderHistoryItem ใหม่
    const newOrder: OrderHistoryItem = {
      id: `ORD-${Date.now()}`,
      email: loginEmail,
      type: "event",
      items: [paidItem],
      totalAmount,
      createdAt: new Date().toISOString(),
      buyerName: fullName.trim(),
      contactEmail: email.trim(),
      phone: phone.trim(),
      paymentMethod: getPaymentMethodLabel(paymentMethod),
    };

    history.push(newOrder);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    // เคลียร์สถานะที่ใช้เฉพาะ payment จาก Event
    localStorage.removeItem("currentEventId");

    setShowQR(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
          {/* ซ้าย: ข้อมูล + ฟอร์ม */}
          <section className="space-y-4">
            {/* กล่องรายละเอียดอีเวนต์ */}
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 flex gap-4">
              <div className="h-28 w-40 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <img
                  src={event.banner}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 text-sm">
                <p className="text-[11px] font-semibold uppercase text-slate-500">
                  {event.id ?? ""}
                </p>
                <h1 className="text-lg font-bold text-slate-900">
                  {event.title}
                </h1>
                {event.subtitle && (
                  <p className="mt-1 text-slate-600">{event.subtitle}</p>
                )}
                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  {event.dateRange && <p>วันจัดงาน {event.dateRange}</p>}
                  {event.venue && <p>สถานที่จัดงาน {event.venue}</p>}
                  {event.Time && <p>เวลา {event.Time}</p>}
                </div>
              </div>
            </div>

            {/* ฟอร์มผู้ซื้อ + โซนที่นั่ง */}
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 space-y-4">
              <h2 className="text-base font-semibold text-slate-900">
                ข้อมูลผู้ซื้อ
              </h2>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-sm text-slate-700">
                    ชื่อและนามสกุล
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#234C6A] focus:outline-none focus:ring-1 focus:ring-[#234C6A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm text-slate-700">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#234C6A] focus:outline-none focus:ring-1 focus:ring-[#234C6A]"
                  />
                </div>
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
                />
              </div>

              <hr className="my-2 border-slate-200" />

              <h3 className="text-sm font-semibold text-slate-900">
                เลือกที่นั่งและจำนวนบัตร
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-sm text-slate-700">
                    โซนที่นั่ง
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    value={selectedTier.name}
                    onChange={(e) => {
                      const tier =
                        event.prices.find(
                          (p: PriceTier) => p.name === e.target.value
                        ) ?? selectedTier;
                      setSelectedTier(tier);
                    }}
                  >
                    {event.prices.map((tier: PriceTier) => (
                      <option key={tier.name} value={tier.name}>
                        {tier.name} ราคา {tier.price.toLocaleString()} บาท
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm text-slate-700">
                    จำนวนบัตร
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={ticketQty}
                    onChange={(e) =>
                      setTicketQty(Math.max(1, Number(e.target.value) || 1))
                    }
                    className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <hr className="my-2 border-slate-200" />

              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  วิธีชำระเงิน
                </p>
                <div className="space-y-1 text-sm text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pay"
                      value="mobile"
                      checked={paymentMethod === "mobile"}
                      onChange={() => setPaymentMethod("mobile")}
                      className="h-4 w-4"
                    />
                    โอนผ่าน Mobile Banking
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pay"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="h-4 w-4"
                    />
                    บัตรเครดิต / เดบิต
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pay"
                      value="onsite"
                      checked={paymentMethod === "onsite"}
                      onChange={() => setPaymentMethod("onsite")}
                      className="h-4 w-4"
                    />
                    จ่ายปลายทางที่หน้างาน (สำหรับงานที่รองรับ)
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* ขวา: สรุปคำสั่งซื้อ */}
          <aside className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 text-sm">
            <h2 className="mb-3 text-base font-semibold text-slate-900">
              สรุปคำสั่งซื้อ
            </h2>

            <div className="flex gap-3 rounded-lg border border-slate-200 p-2 mb-3">
              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                <img
                  src={event.banner}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="line-clamp-2 text-[13px] font-medium text-slate-900">
                  {event.title}
                </p>
                <p className="text-[12px] text-slate-600">
                  โซนที่นั่ง: {selectedTier.name}
                </p>
                <p className="text-[12px] text-slate-600">
                  จำนวน {ticketQty} ใบ
                </p>
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>ราคาต่อใบ</span>
                <span>{selectedTier.price.toLocaleString()} บาท</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>ยอดชำระรวม</span>
                <span>{totalAmount.toLocaleString()} บาท</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmPayment}
              className="mt-4 w-full rounded-lg bg-[#234C6A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1c3f55]"
            >
              ยืนยันการชำระเงิน
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              กลับไปหน้าก่อนหน้า
            </button>
          </aside>
        </div>
      </main>

      <Footer />

      {/* Popup QR Code */}
      {showQR && (
        <Qrcode
          amount={totalAmount}
          onClose={() => setShowQR(false)}
          onPaid={handlePaidFromQR}
        />
      )}
    </div>
  );
}
