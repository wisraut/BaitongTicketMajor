import React, { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";


/* โครงข้อมูลสไลด์ */
export type Slide = {
  id: number;
  imageUrl: string;
  caption?: string;
  href?: string;
  title?: string;
};

/** พร็อพของคอมโพเนนต์ */
type Props = {
  slides: Slide[]; 
  layout?: "full" | "contained";
  autoPlayMs?: number; 
};

export default function FrontBanner({ slides, layout = "contained", autoPlayMs = 4000 }: Props) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startXRef = useRef<number | null>(null);
  const len = slides.length;
  const stop = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = () => {
    stop();
    if (len > 1) {
      timerRef.current = window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % len);
      }, autoPlayMs);
    }
  };

  // รันใหม่ทุกครั้งที่ index เปลี่ยน หรือค่าเวลาถูกปรับ
  useEffect(() => {
    start();
    return stop;
  }, [index, autoPlayMs, len]);

  const goTo = (i: number) => setIndex(((i % len) + len) % len);

  const onPointerDown = (e: React.PointerEvent) => {
    startXRef.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    stop();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (startXRef.current != null) {
      const dx = e.clientX - startXRef.current;
      if (Math.abs(dx) > 40) {
        goTo(index + (dx < 0 ? 1 : -1));
      }
      startXRef.current = null;
      start();
    }
  };

  if (len === 0) return null;

  return (
    <section
      className={`relative select-none ${layout === "full" ? "w-screen left-1/2 -translate-x-1/2" : "w-full" }`}
      aria-roledescription="carousel"
      onMouseEnter={stop}
      onMouseLeave={start}
    >
    <div className="relative w-screen left-1/2 -translate-x-1/2 bg-black">
      <div className="relative mx-auto w-full max-w-[1100px] p-3">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            {slides.map((s) => (
              <a key={s.id} href={s.href ?? "#"} className="shrink-0 w-full">
                <div className="relative w-full h-[200px] sm:h-[230px] md:h-[280px] lg:h-[320px]">
                  <img
                    src={s.imageUrl}
                    alt={s.title ?? ""}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                  {s.title && (
                    <div className="absolute bottom-4 left-4 text-white text-lg md:text-2xl font-semibold drop-shadow">
                      {s.title}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div> 
      <button
        onClick={() => goTo(index - 1)}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 focus:outline-none"
      >
        <ArrowLeftIcon className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={() => goTo(index + 1)}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 focus:outline-none"
      >
        <ArrowRightIcon className="h-6 w-6 text-white" />
      </button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`ไปสไลด์ที่ ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2 w-2 rounded-full ${
              i === index ? "bg-white" : "bg-white/50"
            } hover:bg-white`}
          />
        ))}
      </div>
    </section>
  );
}