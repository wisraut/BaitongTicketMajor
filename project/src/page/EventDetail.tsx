// src/page/EventDetail.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../firebase";
import type { Event } from "../data/eventconcert";

import { EVENTS as CONCERT_EVENTS } from "../data/eventconcert";
import { EVENTS as BOXING_EVENTS } from "../data/eventboxing";
import { EVENTS as PERFORMANCE_EVENTS } from "../data/eventperformance";

import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";

const ALL_EVENTS: Event[] = [
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

  // state สำหรับ event ที่จะเอามาแสดง + loading
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // โหลด user จาก localStorage
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

  // หา event จาก data + Firestore
  useEffect(() => {
    if (!id) return;

    setLoading(true);

    // 1) หาใน data เดิมก่อน
    const fromBase = ALL_EVENTS.find((e) => e.id === id);
    if (fromBase) {
      setEvent(fromBase);
      setLoading(false);
      return;
    }

    // 2) ถ้าไม่เจอ ไปหาใน Firestore
    const fetchFromFirestore = async () => {
      try {
        const q = query(
          collection(db, "events"),
          where("id", "==", id),
          limit(1)
        );
        const snap = await getDocs(q);

        if (!snap.empty) {
          const data = snap.docs[0].data() as any;

          const fromDb: Event = {
            id: data.id ?? id,
            title: data.title ?? "",
            subtitle: data.subtitle ?? "",
            banner: data.banner ?? "",
            dateRange: data.dateRange ?? "",
            Time: data.Time ?? "",
            stageImage: data.stageImage ?? "",
            venue: data.venue ?? "",
            description: data.description ?? "",
            prices: Array.isArray(data.prices)
              ? data.prices.map((p: any) => ({
                  name: String(p.name ?? ""),
                  price: Number(p.price ?? 0),
                }))
              : [],
          };

          setEvent(fromDb);
        } else {
          setEvent(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFromFirestore();
  }, [id]);

  const handleGoPayment = () => {
    if (!event) return;
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    localStorage.setItem("currentEventId", event.id);
    navigate("/payment");
  };

  const handleAddToCart = () => {
    if (!event) return;
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

  // ระหว่างโหลด
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-10 text-center text-slate-600">กำลังโหลด...</main>
        <Footer />
      </div>
    );
  }

  // หาไม่เจอทั้ง data + Firestore
  if (!event) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-10 text-center text-slate-600">ไม่พบงานแสดง</main>
        <Footer />
      </div>
    );
  }

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
              {event.dateRange && (
                <p className="text-sm text-slate-200">
                  วันจัดงาน {event.dateRange}
                </p>
              )}
              {event.venue && (
                <p className="text-sm text-slate-200">
                  สถานที่จัดงาน {event.venue}
                </p>
              )}
              {event.Time && (
                <p className="text-sm text-slate-200">เวลา {event.Time}</p>
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

        {event.stageImage && (
          <div className="flex justify-center pb-8">
            <img
              src={event.stageImage}
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
