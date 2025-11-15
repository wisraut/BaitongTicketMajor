import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";

import { EVENTS as CONCERT_EVENTS } from "../data/eventconcert";
import { EVENTS as BOXING_EVENTS } from "../data/eventboxing";
import { EVENTS as GIFTSHOP_EVENTS } from "../data/eventgiftshop";
import { EVENTS as PERFORMANCE_EVENTS } from "../data/eventperformance";

const ALL_EVENTS = [
  ...CONCERT_EVENTS,
  ...BOXING_EVENTS,
  ...GIFTSHOP_EVENTS,
  ...PERFORMANCE_EVENTS,
];

type PriceTier = (typeof ALL_EVENTS)[number]["prices"][number];

export default function Payment() {
  const [event, setEvent] = useState<(typeof ALL_EVENTS)[number] | null>(null);
  const [selectedTier, setSelectedTier] = useState<PriceTier | null>(null);
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("currentEventId");
    if (!id) {
      navigate("/events");
      return;
    }
    const found = ALL_EVENTS.find((e) => e.id === id);
    if (!found) {
      navigate("/events");
      return;
    }
    setEvent(found);
  }, [navigate]);

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500 text-sm">กำลังโหลดข้อมูลงานแสดง</p>
      </div>
    );
  }

  const handleConfirmPayment = () => {
    if (!selectedTier) {
      return;
    }
    const payload = {
      eventId: event.id,
      eventTitle: event.title,
      dateRange: event.dateRange,
      time: event.Time,
      venue: event.venue,
      banner: event.banner,
      tierName: selectedTier.name,
      price: selectedTier.price,
      quantity: qty,
      total: selectedTier.price * qty,
    };
    localStorage.setItem("lastOrder", JSON.stringify(payload));
    localStorage.removeItem("currentEventId");
    navigate("/");
  };

  const total = selectedTier ? selectedTier.price * qty : 0;

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 flex gap-4">
            {event.banner && (
              <img
                src={event.banner}
                alt={event.title}
                className="hidden sm:block h-24 w-24 rounded-lg object-cover"
              />
            )}
            <div className="flex-1 text-sm space-y-1">
              <p className="text-xs uppercase text-slate-400">{event.id}</p>
              <p className="font-semibold text-slate-900">{event.title}</p>
              {event.dateRange && (
                <p className="text-slate-600">วันจัดงาน {event.dateRange}</p>
              )}
              {event.Time && (
                <p className="text-slate-600">เวลา {event.Time}</p>
              )}
              {event.venue && (
                <p className="text-slate-600">สถานที่จัดงาน {event.venue}</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 space-y-4 text-sm">
            <h2 className="font-semibold text-slate-900">ข้อมูลผู้ซื้อ</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-slate-600 mb-1">
                  ชื่อและนามสกุล
                </label>
                <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">อีเมล</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <h2 className="font-semibold text-slate-900">
                เลือกที่นั่งและจำนวนบัตร
              </h2>
              <div className="space-y-2">
                <label className="block text-slate-600 text-sm">
                  โซนที่นั่ง
                </label>
                <select
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={selectedTier?.name ?? ""}
                  onChange={(e) => {
                    const tier =
                      event.prices.find(
                        (p: PriceTier) => p.name === e.target.value
                      ) || null;
                    setSelectedTier(tier);
                  }}
                >
                  <option value="">เลือกโซนที่นั่ง</option>
                  {event.prices.map((tier: PriceTier) => (
                    <option key={tier.name} value={tier.name}>
                      {tier.name} ราคา {tier.price.toLocaleString()} บาท
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-600 text-sm">
                  จำนวนบัตร
                </label>
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
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 space-y-3 text-sm">
            <h2 className="font-semibold text-slate-900">สรุปคำสั่งซื้อ</h2>
            <div className="flex justify-between">
              <span>โซนที่นั่ง</span>
              <span>{selectedTier ? selectedTier.name : "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>ราคาต่อใบ</span>
              <span>
                {selectedTier ? selectedTier.price.toLocaleString() : 0} บาท
              </span>
            </div>
            <div className="flex justify-between">
              <span>จำนวน</span>
              <span>{qty} ใบ</span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between font-semibold">
              <span>ยอดชำระรวม</span>
              <span>{total.toLocaleString()} บาท</span>
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={!selectedTier}
              className="mt-4 w-full rounded-lg bg-[#234C6A] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-400"
            >
              ยืนยันการชำระเงิน
            </button>
            <button
              onClick={() => navigate(-1)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700"
            >
              กลับไปหน้าก่อนหน้า
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
