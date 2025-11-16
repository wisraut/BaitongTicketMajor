import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EVENTS as CONCERT_EVENTS } from "../data/eventconcert";
import { EVENTS as BOXING_EVENTS } from "../data/eventboxing";
import { EVENTS as PERFORMANCE_EVENTS } from "../data/eventperformance";

import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";

const ALL_EVENTS = [
  ...CONCERT_EVENTS,
  ...BOXING_EVENTS,
  ...PERFORMANCE_EVENTS,
];

type LoggedInUser = {
  email: string;
  phone?: string;
  name?: string;
};

type CartItem = {
  id: string;
  type: "event" | "product";
  title: string;
  image: string;
  option?: string;
  unitPrice: number;
  quantity: number;
};

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("loggedInUser");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const event = ALL_EVENTS.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-slate-600">ไม่พบงานแสดง</p>
      </div>
    );
  }

  const handleGoPayment = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    localStorage.setItem("currentEventId", event.id);
    navigate("/payment");
  };

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    const prices = (event as any).prices as
      | { name: string; price: number }[]
      | undefined;

    const defaultTier = prices && prices.length > 0 ? prices[0] : undefined;

    const cartItem: CartItem = {
      id: defaultTier
        ? `${event.id}:${defaultTier.name}`
        : `${event.id}:default`,
      type: "event",
      title: event.title,
      image: event.banner,
      option: defaultTier ? defaultTier.name : undefined,
      unitPrice: defaultTier ? defaultTier.price : 0,
      quantity: 1,
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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="bg-black">
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-10">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/3">
              {event.banner && (
                <img
                  src={event.banner}
                  alt={event.title}
                  className="w-full rounded-lg object-cover"
                />
              )}
            </div>
            <div className="flex-1 space-y-3 text-center md:text-left text-white">
              <h1 className="text-2xl font-bold">{event.title}</h1>
              {event.subtitle && (
                <p className="text-sm text-slate-200">{event.subtitle}</p>
              )}
              {(event as any).dateRange && (
                <p className="text-sm text-slate-200">
                  วันจัดงาน {(event as any).dateRange}
                </p>
              )}
              {(event as any).venue && (
                <p className="text-sm text-slate-200">
                  สถานที่จัดงาน {(event as any).venue}
                </p>
              )}
              {(event as any).Time && (
                <p className="text-sm text-slate-200">
                  เวลา {(event as any).Time}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                <button
                  type="button"
                  onClick={handleGoPayment}
                  className="inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                  จองบัตร
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="inline-flex items-center justify-center rounded-full border border-white/60 px-8 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                >
                  เพิ่มลงตะกร้า
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {event.description && (
          <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-800">
            {event.description}
          </div>
        )}

        {(event as any).stageImage && (
          <div className="flex justify-center pb-8">
            <img
              src={(event as any).stageImage}
              alt="ผังที่นั่ง"
              className="max-w-full rounded-lg object-contain"
            />
          </div>
        )}
      </div>

      <Footer />

      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              กรุณาเข้าสู่ระบบ
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              กรุณาเข้าสู่ระบบก่อนทำการจองบัตรหรือเพิ่มงานแสดงลงตะกร้า
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate("/login");
                }}
                className="rounded-lg bg-[#234C6A] px-4 py-2 text-sm font-semibold text-white"
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
