import React, { useRef } from "react";
import EventCard from "../home/EventCard";
import type { EventItem } from "../home/EventCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SectionProps = {
  title: string;
  items: EventItem[];
  scrollable?: boolean;
  minItemsForScroll?: number;
};

export default function Section({
  title,
  items,
  scrollable = false,
  minItemsForScroll = 5,
}: SectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const shouldShowButtons = scrollable && items.length >= minItemsForScroll;

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 280;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      {/* ปุ่มซ้าย */}
      {shouldShowButtons && (
        <button
          onClick={() => scrollBy("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-slate-200 hover:bg-slate-50"
        >
          <ChevronLeft className="h-5 w-5 text-slate-700" />
        </button>
      )}

      {scrollable ? (
        // โหมดเลื่อนแนวนอน (ไว้ใช้หน้า Home)
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth no-scrollbar"
        >
          {items.map((item) => (
            <div key={item.id} className="min-w-[220px] max-w-[220px]">
              <EventCard item={item} />
            </div>
          ))}
        </div>
      ) : (
        // โหมดปกติ: ใช้ grid ให้ 5 อันบนจอใหญ่
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item.id}>
              <EventCard item={item} />
            </div>
          ))}
        </div>
      )}

      {/* ปุ่มขวา */}
      {shouldShowButtons && (
        <button
          onClick={() => scrollBy("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-slate-200 hover:bg-slate-50"
        >
          <ChevronRight className="h-5 w-5 text-slate-700" />
        </button>
      )}
    </section>
  );
}
