// src/page/EventDetail.tsx
import { useParams, Link } from "react-router-dom";

// ดึงทุกหมวด
import { EVENTS as CONCERT_EVENTS } from "../data/eventconcert";
import { EVENTS as BOXING_EVENTS } from "../data/eventboxing";
import { EVENTS as GIFTSHOP_EVENTS } from "../data/eventgiftshop";
import { EVENTS as PERFORMANCE_EVENTS } from "../data/eventperformance";
import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";

// ทำ type หลวมๆ ครอบทุกหมวด
type AnyEvent = {
  id: string;
  title: string;
  subtitle?: string;
  banner?: string;
  dateRange?: string;
  venue?: string;
  description?: string;
  stageImage?: string;
  prices?: { name: string; price: number }[];
  Time?: string;
};

// รวมเป็นก้อนเดียว
const ALL_EVENTS: AnyEvent[] = [
  ...CONCERT_EVENTS,
  ...BOXING_EVENTS,
  ...GIFTSHOP_EVENTS,
  ...PERFORMANCE_EVENTS,
];

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const event = ALL_EVENTS.find((e) => e.id === id);

  if (!event) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 max-w-5xl mx-auto p-6">
            <p className="text-lg font-semibold mb-2">ไม่พบอีเวนต์นี้</p>
            <Link to="/" className="text-blue-500 underline">
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen flex flex-col bg-white">
        {/* แถบดำด้านบน */}
        <div className="w-full bg-black text-white">
          <div className="max-w-6xl mx-auto px-4 pt-14 pb-8 flex gap-6 items-center min-h-[180px]">
            {/* รูปโปสเตอร์ */}
            {event.banner ? (
              <div className="w-36 md:w-48 flex-shrink-0">
                <img
                  src={event.banner}
                  alt={event.title}
                  className="w-full h-auto rounded"
                />
              </div>
            ) : null}

            {/* ข้อมูลขวา */}
            <div className="flex-1 space-y-2">
              <h1 className="text-xl md:text-2xl font-semibold leading-snug">
                {event.title}
              </h1>

              {event.subtitle ? (
                <p className="text-sm text-gray-200">{event.subtitle}</p>
              ) : null}

              <div className="text-sm md:text-base space-y-1 mt-2">
                {event.dateRange ? <p>{event.dateRange}</p> : null}

                {event.venue ? (
                  <p className="font-semibold underline underline-offset-2">
                    {event.venue}
                  </p>
                ) : null}

                <p>{event.Time ?? "19:00 PM"}</p>
              </div>

              <button className="mt-4 bg-red-500 hover:bg-red-600 transition text-white px-6 py-2 rounded font-semibold text-sm">
                จองบัตร
              </button>
            </div>
          </div>
        </div>

        {/* เนื้อหาด้านล่าง */}
        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-4 md:px-0 py-8 space-y-8">
            <div className="space-y-4 text-sm leading-relaxed text-gray-800">
              {event.description ? <p>{event.description}</p> : null}

              {event.prices && event.prices.length > 0 ? (
                <div>
                  <p className="font-semibold mb-2">ประเภทบัตร / ราคา</p>
                  <ul className="list-disc list-inside space-y-1">
                    {event.prices.map((tier) => (
                      <li key={tier.name}>
                        {tier.name} — {tier.price.toLocaleString()} บาท
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {event.stageImage ? (
              <div className="flex justify-center">
                <img
                  src={event.stageImage}
                  alt="stage plan"
                  className="w-full max-w-md rounded border"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
