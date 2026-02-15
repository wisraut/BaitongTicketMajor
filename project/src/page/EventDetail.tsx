// src/page/EventDetail.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import * as Select from "@radix-ui/react-select";
import { db } from "../firebase";

import { EVENTS as CONCERT_EVENTS } from "../data/eventconcert";
import { EVENTS as BOXING_EVENTS } from "../data/eventboxing";
import { EVENTS as PERFORMANCE_EVENTS } from "../data/eventperformance";

import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";

// ---- type รวมของ event ทุกแบบ (ไฟล์ data + Firestore) ----
type PriceTier = {
  name: string;
  price: number;
};

type AnyEvent = {
  id: string;
  title: string;
  subtitle?: string;
  banner: string;
  dateRange?: string;
  Time?: string;
  stageImage?: string;
  venue?: string;
  description?: string;
  prices?: PriceTier[];
};

const STATIC_EVENTS: AnyEvent[] = [
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
  option?: string; // ชื่อโซน / size
  unitPrice: number;
  quantity: number;
  eventdate?: string;
  eventlocation?: string;
  eventtime?: string;
};

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [event, setEvent] = useState<AnyEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [selectedTierName, setSelectedTierName] = useState<string>("");
  const [ticketQty, setTicketQty] = useState<number>(1);

  // ดึง user จาก localStorage
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

  // โหลด event จาก static + Firestore
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fromStatic = STATIC_EVENTS.find((e) => e.id === id);
    if (fromStatic) {
      setEvent(fromStatic);
      setLoading(false);
      return;
    }

    const fetchFromFirestore = async () => {
      try {
        const q = query(
          collection(db, "events"),
          where("id", "==", id),
          limit(1)
        );
        const snap = await getDocs(q);

        if (snap.empty) {
          setEvent(null);
        } else {
          const docSnap = snap.docs[0];
          const data = docSnap.data() as {
            id?: string;
            title?: string;
            subtitle?: string;
            banner?: string;
            dateRange?: string;
            Time?: string;
            stageImage?: string;
            venue?: string;
            description?: string;
            prices?: { name?: string; price?: number }[];
          };

          const fromDb: AnyEvent = {
            id: data.id ?? id,
            title: data.title ?? "",
            subtitle: data.subtitle ?? "",
            banner: data.banner ?? "",
            dateRange: data.dateRange ?? "",
            Time: data.Time ?? "",
            venue: data.venue ?? "",
            stageImage: data.stageImage ?? "",
            description: data.description ?? "",
            prices: Array.isArray(data.prices)
              ? data.prices.map((p): PriceTier => ({
                  name: String(p.name ?? ""),
                  price: Number(p.price ?? 0),
                }))
              : [],
          };

          setEvent(fromDb);
        }
      } catch (error) {
        console.log("[EventDetail] load error", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFromFirestore();
  }, [id]);

  // ตั้งค่า default tier เมื่อได้ event ใหม่
  useEffect(() => {
    if (event?.prices && event.prices.length > 0) {
      setSelectedTierName(event.prices[0].name);
    }
  }, [event]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-slate-600">กำลังโหลดข้อมูลงานแสดง…</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-slate-600">ไม่พบงานแสดง</p>
      </div>
    );
  }

  const prices = event.prices ?? [];
  const defaultTier = prices.length > 0 ? prices[0] : undefined;
  const selectedTier =
    prices.find((p) => p.name === selectedTierName) ?? defaultTier;

  // อ่าน cart ปัจจุบันจาก localStorage
  function readCart(): CartItem[] {
    const raw = localStorage.getItem("cartItems");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch {
      return [];
    }
  }

  function writeCart(items: CartItem[]) {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }

  function buildCartItem(): CartItem {
    if (!event) {
      throw new Error("Event not loaded");
    }

    const tier = selectedTier;
    const safeQty = Math.max(1, ticketQty || 1);

    return {
      id: tier ? `${event.id}:${tier.name}` : `${event.id}:default`,
      type: "event",
      title: event.title,
      image: event.banner,
      option: tier?.name,
      unitPrice: tier?.price ?? 0,
      quantity: safeQty,
      eventdate: event.dateRange,
      eventlocation: event.venue,
      eventtime: event.Time,
    };
  }

  const requireLogin = (cb: () => void) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    cb();
  };

  const handleAddToCart = () => {
    requireLogin(() => {
      const items = readCart();
      items.push(buildCartItem());
      writeCart(items);
      navigate("/cart");
    });
  };

  const handleGoPayment = () => {
    requireLogin(() => {
      const items = readCart();
      items.push(buildCartItem());
      writeCart(items);
      navigate("/payment");
    });
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

              {defaultTier && (
                <p className="mt-1 text-sm text-slate-200">
                  ราคาบัตรเริ่มต้น {defaultTier.name}{" "}
                  {defaultTier.price.toLocaleString()} บาท
                </p>
              )}

              {/* กล่องเลือกประเภทบัตรและจำนวน */}
              {prices.length > 0 && (
                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 text-left">
                  <p className="font-semibold mb-3 text-sm">
                    เลือกประเภทบัตรและจำนวน
                  </p>
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* ประเภทบัตร */}
                    <div className="flex-1 w-full">
                      <label className="text-xs text-slate-300">
                        ประเภทบัตร
                      </label>
                      <Select.Root
                        value={selectedTierName}
                        onValueChange={setSelectedTierName}
                      >
                        <Select.Trigger className="mt-1 w-full bg-slate-800 text-white px-4 py-2 rounded-md text-left text-sm">
                          <Select.Value placeholder="เลือกประเภทบัตร" />
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content className="bg-slate-800 text-white rounded-md shadow-lg">
                            {prices.map((p) => (
                              <Select.Item
                                key={p.name}
                                value={p.name}
                                className="px-4 py-2 cursor-pointer hover:bg-slate-700 text-sm"
                              >
                                {p.name} - {p.price.toLocaleString()} บาท
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                    </div>

                    {/* จำนวนบัตร */}
                    <div className="w-24">
                      <label className="text-xs text-slate-300">
                        จำนวนบัตร
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={ticketQty}
                        onChange={(e) =>
                          setTicketQty(Math.max(1, Number(e.target.value) || 1))
                        }
                        className="mt-1 w-full bg-white text-black px-3 py-2 rounded-md text-sm"
                      />
                    </div>
                  </div>
                </div>
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
