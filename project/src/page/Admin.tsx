// src/page/Admin.tsx

import { FormEvent, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";

import AdminEventCard from "../components/admin/AdminEventCard";
import type { AdminEvent, EventCategory } from "../data/adminEvent";

// โซนของราคาบัตรที่ใช้ในฟอร์ม
type PriceRow = {
  name: string;
  price: string; // เก็บเป็น string ในฟอร์ม แปลงเป็น number ตอนส่ง
};

type EventForm = {
  eventId: string;
  title: string;
  subtitle: string;
  dateRange: string;
  time: string;
  venue: string;
  description: string;
  bannerPath: string;
  stageImagePath: string;
  category: EventCategory;
};

const initialForm: EventForm = {
  eventId: "",
  title: "",
  subtitle: "",
  dateRange: "",
  time: "",
  venue: "",
  description: "",
  bannerPath: "",
  stageImagePath: "",
  category: "concert",
};

const initialPrices: PriceRow[] = [{ name: "", price: "0" }];

export default function Admin() {
  const [form, setForm] = useState<EventForm>(initialForm);
  const [prices, setPrices] = useState<PriceRow[]>(initialPrices);

  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // โหลด events จาก Firestore แบบ realtime
  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: AdminEvent[] = snapshot.docs.map((d) => {
        const data = d.data() as any;

        return {
          id: d.id,
          eventId: data.id ?? data.eventId ?? "",
          title: data.title ?? "",
          subtitle: data.subtitle ?? "",
          dateRange: data.dateRange ?? "",
          time: data.Time ?? data.time ?? "",
          venue: data.venue ?? "",
          description: data.description ?? "",
          bannerPath: data.banner ?? data.bannerPath ?? "",
          stageImagePath: data.stageImage ?? data.stageImagePath ?? "",
          category: (data.category as EventCategory) ?? "concert",
          createdAt: data.createdAt,
        };
      });

      setEvents(list);
      setLoadingEvents(false);
    });

    return () => unsubscribe();
  }, []);

  // จัดการเปลี่ยนค่าในฟอร์ม
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // จัดการเปลี่ยนค่าโซนราคา
  const handlePriceChange = (
    index: number,
    field: "name" | "price",
    value: string
  ) => {
    setPrices((prev) =>
      prev.map((p, i) =>
        i === index
          ? {
              ...p,
              [field]: value,
            }
          : p
      )
    );
  };

  const addPriceRow = () => {
    setPrices((prev) => [...prev, { name: "", price: "0" }]);
  };

  const removePriceRow = (index: number) => {
    setPrices((prev) => prev.filter((_, i) => i !== index));
  };

  // บันทึกฟอร์มเข้า Firestore
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.eventId.trim() || !form.title.trim()) {
      alert("กรุณากรอก Event ID และชื่องาน");
      return;
    }

    setSubmitting(true);

    try {
      const cleanPrices = prices
        .filter((p) => p.name.trim() !== "")
        .map((p) => ({
          name: p.name.trim(),
          price: Number(p.price) || 0,
        }));

      await addDoc(collection(db, "events"), {
        // ให้ตรงกับ type Event ที่ใช้ฝั่งหน้าเว็บ
        id: form.eventId.trim(),
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        banner: form.bannerPath.trim(),
        dateRange: form.dateRange.trim(),
        Time: form.time.trim(),
        stageImage: form.stageImagePath.trim(),
        venue: form.venue.trim(),
        description: form.description.trim(),
        prices: cleanPrices,

        // เพิ่ม field เสริมสำหรับ admin
        category: form.category,
        createdAt: serverTimestamp(),
      });

      setForm(initialForm);
      setPrices(initialPrices);
    } catch (error) {
      console.log("[Admin] submit error", error);
      alert("เกิดปัญหาในการบันทึกข้อมูล");
    } finally {
      setSubmitting(false);
    }
  };

  // ลบอีเวนต์จาก Firestore
  const handleDelete = async (docId: string) => {
    const ok = window.confirm("ต้องการลบอีเวนต์นี้ใช่ไหม");
    if (!ok) return;

    await deleteDoc(doc(db, "events", docId));
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f3f6fb]">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          {/* ส่วนหัว Admin */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Admin Panel
              </h1>
              <p className="text-sm text-slate-600">
                สร้าง Event และสินค้าขึ้นมาเพื่อแสดงบนหน้าเว็บ
              </p>
            </div>

            <div className="w-full md:w-64">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                ประเภทที่ต้องการสร้าง
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="concert">Event: Concert</option>
                <option value="sport">Event: Sport</option>
                <option value="performance">Event: Performance</option>
              </select>
            </div>
          </header>

          {/* ฟอร์ม + note ด้านขวา */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.3fr)_minmax(0,1.5fr)] gap-6">
            {/* ซ้าย: ฟอร์ม (พยายามให้ layout ใกล้ของเดิม) */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold mb-2">ข้อมูลงานแสดง</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Event ID + ชื่อ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Event ID
                    </label>
                    <input
                      name="eventId"
                      value={form.eventId}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="เช่น big-mountain-15"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      ชื่อวง / ชื่องาน
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <input
                    name="subtitle"
                    value={form.subtitle}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* วัน เวลา สถานที่ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      ช่วงวันจัดงาน
                    </label>
                    <input
                      name="dateRange"
                      value={form.dateRange}
                      onChange={handleChange}
                      placeholder="เช่น 6–7 December 2025"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      เวลา
                    </label>
                    <input
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      placeholder="เช่น 19:00"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      สถานที่จัดงาน
                    </label>
                    <input
                      name="venue"
                      value={form.venue}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* รายละเอียด */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    รายละเอียด
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                  />
                </div>

                {/* Banner / Stage (ใช้ path หรือ URL แทน file upload จริง) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Banner path หรือ URL
                    </label>
                    <input
                      name="bannerPath"
                      value={form.bannerPath}
                      onChange={handleChange}
                      placeholder="/banners/concert/Bigmountain.jpg"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      ผังที่นั่ง (Stage Image) path หรือ URL
                    </label>
                    <input
                      name="stageImagePath"
                      value={form.stageImagePath}
                      onChange={handleChange}
                      placeholder="/banners/stage/BMMF_ticket.jpg"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* ราคาบัตรแต่ละโซน */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    ราคาบัตรแต่ละโซน
                  </label>

                  {prices.map((p, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] gap-3 items-center"
                    >
                      <input
                        placeholder="ชื่อโซน"
                        value={p.name}
                        onChange={(e) =>
                          handlePriceChange(index, "name", e.target.value)
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <input
                        type="number"
                        placeholder="ราคา"
                        value={p.price}
                        onChange={(e) =>
                          handlePriceChange(index, "price", e.target.value)
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() => removePriceRow(index)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        ลบ
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addPriceRow}
                    className="mt-1 text-xs text-sky-700 font-medium hover:underline"
                  >
                    เพิ่มโซน
                  </button>
                </div>

                {/* ปุ่มบันทึก / เคลียร์ฟอร์ม */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-lg bg-sky-700 text-white text-sm font-medium hover:bg-sky-800 disabled:opacity-60"
                  >
                    {submitting ? "กำลังบันทึก..." : "บันทึก"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setForm(initialForm);
                      setPrices(initialPrices);
                    }}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    ล้างฟอร์ม
                  </button>
                </div>
              </form>
            </section>

            {/* ขวา: note / preview card */}
            <section className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-sm text-slate-700 space-y-1">
                <h2 className="text-base font-semibold mb-1">
                  หมายเหตุการใช้งาน
                </h2>
                <p>
                  • Event จะถูกเก็บที่ collection{" "}
                  <span className="font-mono">events</span>
                </p>
                <p>
                  • สินค้า Shop จะถูกเก็บที่ collection{" "}
                  <span className="font-mono">products</span>
                </p>
                <p>
                  • รูปภาพทั้งหมดใช้ path จาก public หรือจาก Firebase Storage
                  ตามที่กำหนด
                </p>
              </div>
            </section>
          </div>

          {/* รายการอีเวนต์ทั้งหมด + ปุ่มลบ */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">รายการอีเวนต์ทั้งหมด</h2>
              <span className="text-xs text-slate-500">
                ทั้งหมด {events.length} รายการ
              </span>
            </div>

            {loadingEvents ? (
              <div className="text-sm text-slate-600">กำลังโหลดข้อมูล...</div>
            ) : events.length === 0 ? (
              <div className="text-sm text-slate-600">
                ยังไม่มีอีเวนต์ในระบบ
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {events.map((ev) => (
                  <AdminEventCard
                    key={ev.id}
                    event={ev}
                    onDelete={() => handleDelete(ev.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
