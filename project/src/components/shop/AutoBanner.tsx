import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Slide = { src: string; alt?: string; href?: string };
type Props = {
  slides: Slide[];
  interval?: number;        // ms
  aspect?: string;          // "16/6", "21/9", ...
  contained?: boolean;      // ครอบด้วย max-w-7xl
  rounded?: string;         // "rounded-xl" ฯลฯ
  pauseOnHover?: boolean;   // default: true
};

const AutoBanner: React.FC<Props> = ({
  slides,
  interval = 4000,
  aspect = "16/6",
  contained = true,
  rounded = "rounded-2xl",
  pauseOnHover = true,
}) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const max = slides.length;

  // เดินหน้า/ถอยหลัง/ไป index เป้าหมาย (ทำให้ stable ด้วย useCallback)
  const go = useCallback(
    (i: number) => setIndex(() => (((i % max) + max) % max)),
    [max]
  );

  const nextSlide = useCallback(
    () => setIndex((i) => (i + 1) % max),
    [max]
  );

  const prevSlide = useCallback(
    () => setIndex((i) => (i - 1 + max) % max),
    [max]
  );

  // เล่นอัตโนมัติด้วย setInterval (เก็บ id ไว้ใน ref เพื่อ cleanup)
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (max <= 1 || paused) return;
    intervalRef.current = window.setInterval(nextSlide, interval);
    return () => {
      if (intervalRef.current != null) window.clearInterval(intervalRef.current);
    };
  }, [paused, interval, max, nextSlide]);

  const Wrapper = useMemo(
    () =>
      contained
        ? ({ children }: { children: React.ReactNode }) => (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          )
        : ({ children }: { children: React.ReactNode }) => <>{children}</>,
    [contained]
  );

  return (
    <Wrapper>
      <div
        className={`relative overflow-hidden border border-slate-200 bg-white shadow-sm ${rounded}`}
        onMouseEnter={() => pauseOnHover && setPaused(true)}
        onMouseLeave={() => pauseOnHover && setPaused(false)}
      >
        {/* Track แบบเลื่อนแนวนอน */}
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s, i) => (
            <a key={i} href={s.href ?? "#"} className="block w-full shrink-0">
              <div className={`w-full aspect-[${aspect}]`}>
                <img
                  src={s.src}
                  alt={s.alt ?? ""}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            </a>
          ))}
        </div>

        {/* Arrows */}
        {max > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-2 py-1 text-white hover:bg-black/60"
              aria-label="Previous slide"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-2 py-1 text-white hover:bg-black/60"
              aria-label="Next slide"
            >
              ›
            </button>
          </>
        )}

        {/* Dots */}
        {max > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`pointer-events-auto h-1.5 w-5 rounded-full ${
                  i === index ? "bg-white" : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default AutoBanner;
