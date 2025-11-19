// src/page/Home.tsx
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

import Section from "../components/useall/Section";
import Footer from "../components/useall/Footer";
import Header from "../components/useall/Header";
import FrontBanner from "../components/useall/FrontBanner";
import type { EventItem } from "../components/home/EventCard";

// data เดิมในไฟล์ .ts
import { EVENTS as CONCERT_EVENTS } from "../data/eventconcert";
import { EVENTS as BOXING_EVENTS } from "../data/eventboxing";
import { EVENTS as PERFORMANCE_EVENTS } from "../data/eventperformance";
import { SHOP_PRODUCTS } from "../data/shopProducts";

// สไลด์สำหรับ FrontBanner
const slides = [
  { id: 1, imageUrl: "/ball.jpg" },
  { id: 2, imageUrl: "/concert.png" },
  { id: 3, imageUrl: "/shirt.jpg" },
];

// แปลง event -> EventItem (ใช้ได้ทั้งของไฟล์ .ts และของ Firestore เพราะ field ชื่อเหมือนกัน)
function toEventItem(event: any, basePath: string): EventItem {
  return {
    id: event.id,
    image: event.banner,
    title: event.title,
    subtitle: event.subtitle,
    date: event.dateRange,
    venue: event.venue,
    time: event.Time ?? "",
    linkTo: `${basePath}/${event.id}`,
  };
}

// แปลง product shop -> EventItem สำหรับใช้กับ card เดิม
function toShopItem(product: any): EventItem {
  return {
    id: product.id,
    image: product.banner,
    title: product.name,
    subtitle: product.subtitle,
    date: "", // สินค้าไม่มีวันที่จัดงาน
    venue: "",
    time: "",
    linkTo: `/shop/${product.id}`,
  };
}

export default function BaiTongTicketPage() {
  // ข้อมูลเดิมในไฟล์ .ts
  const baseConcertItems = CONCERT_EVENTS.map((e) => toEventItem(e, "/events"));
  const baseSportItems = BOXING_EVENTS.map((e) => toEventItem(e, "/events"));
  const basePerformanceItems = PERFORMANCE_EVENTS.map((e) =>
    toEventItem(e, "/events")
  );
  const baseGiftshopItems = SHOP_PRODUCTS.map((p) => toShopItem(p));

  // ข้อมูลเพิ่มจาก Firestore
  const [extraConcertItems, setExtraConcertItems] = useState<EventItem[]>([]);
  const [extraSportItems, setExtraSportItems] = useState<EventItem[]>([]);
  const [extraPerformanceItems, setExtraPerformanceItems] = useState<
    EventItem[]
  >([]);
  const [extraGiftshopItems, setExtraGiftshopItems] = useState<EventItem[]>([]);

  useEffect(() => {
    async function loadFromFirestore() {
      try {
        // ========= events จาก Firestore =========
        const eventsCol = collection(db, "events");

        // Concert
        const concertSnap = await getDocs(
          query(eventsCol, where("type", "==", "concert"))
        );
        setExtraConcertItems(
          concertSnap.docs.map((doc) => toEventItem(doc.data(), "/events"))
        );

        // Sport
        const sportSnap = await getDocs(
          query(eventsCol, where("type", "==", "sport"))
        );
        setExtraSportItems(
          sportSnap.docs.map((doc) => toEventItem(doc.data(), "/events"))
        );

        // Performance
        const perfSnap = await getDocs(
          query(eventsCol, where("type", "==", "performance"))
        );
        setExtraPerformanceItems(
          perfSnap.docs.map((doc) => toEventItem(doc.data(), "/events"))
        );

        // ========= products จาก Firestore =========
        const productsSnap = await getDocs(collection(db, "products"));
        setExtraGiftshopItems(
          productsSnap.docs.map((doc) => toShopItem(doc.data()))
        );
      } catch (err) {
        // แค่ log ไว้ ไม่ต้องทำอะไรเพิ่ม หน้าเว็บยังใช้ข้อมูลจากไฟล์ ts ได้อยู่
        console.error("[Home] loadFromFirestore error", err);
      }
    }

    loadFromFirestore();
  }, []);

  // รวม base + extra เข้าด้วยกัน
  const concertItems = [...baseConcertItems, ...extraConcertItems];
  const sportItems = [...baseSportItems, ...extraSportItems];
  const performanceItems = [...basePerformanceItems, ...extraPerformanceItems];
  const giftshopItems = [...baseGiftshopItems, ...extraGiftshopItems];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        <FrontBanner slides={slides} />

        <Section title="Recommended Events" items={concertItems} scrollable />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <hr className="my-6 border-slate-200" />
        </div>

        <Section title="Sport Events" items={sportItems} scrollable />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <hr className="my-6 border-slate-200" />
        </div>

        <Section title="Giftshop / Special" items={giftshopItems} scrollable />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <hr className="my-6 border-slate-200" />
        </div>

        <Section title="Performance Art" items={performanceItems} scrollable />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <hr className="my-6 border-slate-200" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
