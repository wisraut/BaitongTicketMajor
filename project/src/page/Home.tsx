import Section from "../components/useall/Section";
import Footer from "../components/useall/Footer";
import Header from "../components/useall/Header";
import FrontBanner from "../components/useall/FrontBanner";
import type { EventItem } from "../components/home/EventCard";

// รวม EVENT จากแต่ละหมวด
import { EVENTS as CONCERT_EVENTS } from "../data/eventconcert";
import { EVENTS as FOOTBALL_EVENTS } from "../data/eventfootball";
import { EVENTS as GIFTSHOP_EVENTS } from "../data/eventgiftshop";
import { EVENTS as BOXING_EVENTS } from "../data/eventboxing";

// สไลด์สำหรับ FrontBanner
const slides = [
  { id: 1, imageUrl: "/ball.jpg" },
  { id: 2, imageUrl: "/concert.png" },
  { id: 3, imageUrl: "/concert.png" },
];

// แปลงโครง data -> โครงที่การ์ดใช้
function toEventItem(event: any): EventItem {
  return {
    id: event.id,
    image: event.banner,
    title: event.title,
    subtitle: event.subtitle,
    date: event.dateRange,
    venue: event.venue,
    time: event.Time ?? "",
  };
}

export default function BaiTongTicketPage() {
  const concertItems = CONCERT_EVENTS.map(toEventItem);
  const sportItems = [...FOOTBALL_EVENTS, ...BOXING_EVENTS].map(toEventItem);
  const giftshopItems = GIFTSHOP_EVENTS.map(toEventItem);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        <FrontBanner slides={slides} />

        <Section title="Recommended Events" items={concertItems} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <hr className="my-6 border-slate-200" />
        </div>

        <Section title="Sport Events" items={sportItems} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <hr className="my-6 border-slate-200" />
        </div>

        <Section title="Giftshop / Special" items={giftshopItems} />
      </main>
      <Footer />
    </div>
  );
}
