import Section from "../components/useall/Section";
import Footer from "../components/useall/Footer";
import Header from "../components/useall/Header";
import FrontBanner from "../components/useall/FrontBanner";
import type { EventItem } from "../components/home/EventCard";

import { EVENTS as CONCERT_EVENTS } from "../data/eventconcert";
import { EVENTS as BOXING_EVENTS } from "../data/eventboxing";
import { EVENTS as PERFORMANCE_EVENTS } from "../data/eventperformance";
import { SHOP_PRODUCTS } from "../data/shopProducts";

const slides = [
  { id: 1, imageUrl: "/ball.jpg" },
  { id: 2, imageUrl: "/concert.png" },
  { id: 3, imageUrl: "/shirt.jpg" },
];

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

export default function BaiTongTicketPage() {
  const concertItems = CONCERT_EVENTS.map((e) => toEventItem(e, "/events"));
  const sportItems = BOXING_EVENTS.map((e) => toEventItem(e, "/events"));
  const performanceItems = PERFORMANCE_EVENTS.map((e) =>
    toEventItem(e, "/events")
  );
  const giftshopItems = SHOP_PRODUCTS.map((p) => toEventItem(p, "/shop"));

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
