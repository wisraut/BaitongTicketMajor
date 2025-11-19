import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

import Header from "../components/base/Header";
import Footer from "../components/base/Footer";
import { Select } from "@radix-ui/themes";

type EventDetail = ConcertEvent | BoxingEvent | PerformanceEvent;
type PriceTier = EventDetail["prices"][number];

const ALL_EVENTS: EventDetail[] = [
  ...CONCERT_EVENTS,
  ...BOXING_EVENTS,
  ...PERFORMANCE_EVENTS,
];

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
};

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [selectedTierName, setSelectedTierName] = useState<string>("");
  const [ticketQty, setTicketQty] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (!id) return;
    const found = ALL_EVENTS.find((ev) => ev.id === id);
    if (!found) {
      navigate("/events");
      return;
    }
    setEvent(found);
  }, [id, navigate]);

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-500">กำลังโหลดข้อมูลงานแสดง...</p>
      </div>
    );
  }

  const handleBookNow = () => {
    localStorage.setItem("currentEventId", event.id);
    navigate("/payment");
  };

  const handleAddToCart = () => {
    const rawUser = localStorage.getItem("loggedInUser");
    if (!rawUser) {
      setShowLoginPrompt(true);
      return;
    }

    if (!selectedTierName) {
      setErrorMessage("กรุณาเลือกประเภทบัตรก่อนเพิ่มลงตะกร้า");
      return;
    }

    const tier = event.prices.find((p) => p.name === selectedTierName);
    if (!tier) {
      setErrorMessage("ไม่พบบัตรที่เลือก ลองใหม่อีกครั้ง");
      return;
    }

    const rawCart = localStorage.getItem("cartItems");
    let cart: CartItem[] = [];
    if (rawCart) {
      try {
        const parsed = JSON.parse(rawCart);
        if (Array.isArray(parsed)) cart = parsed;
      } catch {
        cart = [];
      }
    }

    const newItem: CartItem = {
      id: `${event.id}-${tier.name}`,
      type: "event",
      title: event.title,
      image: event.banner,
      option: tier.name,
      unitPrice: tier.price,
      quantity: ticketQty,
      eventdate: event.dateRange ?? "",
      eventlocation: event.venue ?? "",
    };

    const existingIndex = cart.findIndex(
      (item) =>
        item.type === "event" &&
        item.id === newItem.id &&
        item.option === newItem.option
    );

    if (existingIndex >= 0) {
      const prev = cart[existingIndex];
      cart[existingIndex] = {
        ...prev,
        quantity: prev.quantity + ticketQty,
      };
    } else {
      cart.push(newItem);
    }

    localStorage.setItem("cartItems", JSON.stringify(cart));
    setErrorMessage(null);
    navigate("/cart");
  };

  const selectTier = event.prices.find((p) => p.name === selectedTierName);
  const totalPreview =
    selectTier && ticketQty > 0 ? selectTier.price * ticketQty : 0;

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="bg-black text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
          <div className="grid gap-6 md:grid-cols-[3fr,4fr] items-start">
            {/* ซ้าย: รูปโปสเตอร์ */}
            <div className="flex justify-center">
              <img
                src={event.banner}
                alt={event.title}
                className="w-full max-w-md rounded-xl object-cover shadow-lg"
              />
            </div>

            {/* ขวา: รายละเอียด + เลือกบัตร */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {event.title}
                </h1>
                {event.subtitle && (
                  <p className="mt-1 text-sm text-slate-200">
                    {event.subtitle}
                  </p>
                )}
              </div>

              <div className="space-y-1 text-sm">
                {event.dateRange && (
                  <p className="text-slate-200">วันจัดงาน {event.dateRange}</p>
                )}
                {event.venue && (
                  <p className="text-slate-200">สถานที่จัดงาน {event.venue}</p>
                )}
                {event.Time && (
                  <p className="text-slate-200">เวลา {event.Time}</p>
                )}
              </div>

              {/* เลือกประเภทบัตร + จำนวน */}
              <div className="space-y-4 rounded-2xl bg-gray-800 opacity-70 p-4 border border-white/30 ">
                <h2 className="text-sm font-semibold">
                  เลือกประเภทบัตรและจำนวน
                </h2>

                <div className="grid gap-3 md:grid-cols-[2fr,1fr] items-end">
                  {/* ประเภทบัตร – Radix Select */}
                  <div className="space-y-2">
                    <label className="block text-xs text-slate-200">
                      ประเภทบัตร
                    </label>

                    <Select.Root
                      value={selectedTierName || undefined}
                      onValueChange={(value) => {
                        setSelectedTierName(value);
                        setErrorMessage(null);
                      }}
                    >
                      {/* หุ้ม Trigger ให้เต็มความกว้าง */}
                      <div className="w-full">
                        <Select.Trigger
                          placeholder="เลือกประเภทบัตร"
                          style={{ width: "100%" }}
                        />
                      </div>

                      <Select.Content
                        className="
                          border border-slate-700
                          text-sm text-slate-50
                          shadow-xl
                        "
                      >
                        {event.prices.map((tier: PriceTier) => (
                          <Select.Item
                            key={tier.name}
                            value={tier.name}
                            className="
                              px-3 py-1.5 cursor-pointer
                              data-[highlighted]:bg-slate-700/60
                            "
                          >
                            {tier.name} – {tier.price.toLocaleString()} บาท
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </div>

                  {/* จำนวนบัตร */}
                  <div className="space-y-2">
                    <label className="block text-xs text-slate-200">
                      จำนวนบัตร
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={ticketQty}
                      onChange={(e) =>
                        setTicketQty(Math.max(1, Number(e.target.value) || 1))
                      }
                      className="
                        w-24
                          rounded-lg bg-white
                          px-3 py-2
                          text-sm text-slate-900
                          focus:outline-none
                          focus:ring-2 focus:ring-slate-700/60
                      "
                    />
                  </div>
                </div>

                {totalPreview > 0 && (
                  <p className="text-xs text-slate-200">
                    ยอดชำระโดยประมาณ{" "}
                    <span className="font-semibold">
                      {totalPreview.toLocaleString()} บาท
                    </span>
                  </p>
                )}

                {errorMessage && (
                  <p className="text-xs text-red-300">{errorMessage}</p>
                )}
              </div>

              {/* ปุ่ม action */}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleBookNow}
                  className="rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white hover:bg-red-600 transition"
                >
                  จองบัตร
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="rounded-full border border-white/40 px-6 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  เพิ่มลงตะกร้า
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* กล่องรายละเอียดด้านล่าง */}
        <section className="bg-slate-100 text-slate-900">
          <div className="mx-auto max-w-6xl px-4 py-6">
            <div className="rounded-2xl bg-white p-4 text-sm leading-relaxed shadow-sm">
              <h2 className="mb-2 text-base font-semibold">
                เงื่อนไข / รายละเอียดงาน
              </h2>
              <p className="whitespace-pre-line">{event.description}</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* popup ให้ล็อกอินก่อน */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-5 text-slate-900 shadow-xl">
            <h3 className="mb-2 text-base font-semibold">
              กรุณาเข้าสู่ระบบก่อน
            </h3>
            <p className="mb-4 text-sm text-slate-600">
              คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถเพิ่มบัตรลงตะกร้าได้
            </p>
            <div className="flex justify-end gap-3 text-sm">
              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate("/login");
                }}
                className="rounded-lg bg-[#234C6A] px-4 py-1.5 font-semibold text-white"
              >
                ไปหน้าเข้าสู่ระบบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}