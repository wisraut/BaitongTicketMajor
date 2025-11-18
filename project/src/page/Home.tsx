import { useSearchParams } from "react-router-dom";

import Section from "../components/useall/Section";
import Footer from "../components/useall/Footer";
import Header from "../components/useall/Header";
import FrontBanner from "../components/useall/FrontBanner";
import type { EventItem } from "../components/home/EventCard";

import {
  EVENTS as CONCERT_EVENTS,
  type Event as ConcertEvent,
} from "../data/eventconcert";
import {
  EVENTS as BOXING_EVENTS,
  type Event as BoxingEvent,
} from "../data/eventboxing";
import {
  EVENTS as PERFORMANCE_EVENTS,
  type Event as PerformanceEvent,
} from "../data/eventperformance";
import { SHOP_PRODUCTS } from "../data/shopProducts";

const slides = [
  { id: 1, imageUrl: "/ball.jpg" },
  { id: 2, imageUrl: "/concert.png" },
  { id: 3, imageUrl: "/shirt.jpg" },
];

type AnyEvent = ConcertEvent | BoxingEvent | PerformanceEvent;

type ShopProductLike = {
  id: string;
  name: string;
  images: string[];
  subtitle?: string;
};

function toEventItem(event: AnyEvent, basePath: string): EventItem {
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
  const [params] = useSearchParams();
  const seaching = (params.get("seaching") || "").trim().toLowerCase();

  // แหล่งข้อมูลดิบ
  const recommendedSource: AnyEvent[] = [
    ...CONCERT_EVENTS,
    ...BOXING_EVENTS,
  ];
  const sportSource: AnyEvent[] = [...BOXING_EVENTS];
  const performanceSource: AnyEvent[] = [...PERFORMANCE_EVENTS];

  const products = SHOP_PRODUCTS as ShopProductLike[];

  const matchesEvent = (ev: AnyEvent) => {
    if (!seaching) return true;
    const haystack = `${ev.title ?? ""} ${ev.subtitle ?? ""} ${ev.venue ?? ""}`;
    return haystack.toLowerCase().includes(seaching);
  };

  const matchesProduct = (p: ShopProductLike) => {
    if (!seaching) return true;
    const haystack = `${p.name ?? ""} ${p.subtitle ?? ""}`;
    return haystack.toLowerCase().includes(seaching);
  };

  // filter ตาม seaching
  const filteredRecommended = recommendedSource.filter(matchesEvent);
  const filteredSport = sportSource.filter(matchesEvent);
  const filteredPerformance = performanceSource.filter(matchesEvent);
  const filteredProducts = products.filter(matchesProduct);

  // map เป็น EventItem สำหรับ Section
  const recommendedItems: EventItem[] = filteredRecommended.map((e) =>
    toEventItem(e, "/events")
  );
  const sportItems: EventItem[] = filteredSport.map((e) =>
    toEventItem(e, "/events")
  );
  const performanceItems: EventItem[] = filteredPerformance.map((e) =>
    toEventItem(e, "/events")
  );
  const giftshopItems: EventItem[] = filteredProducts.map((p) => ({
    id: p.id,
    image: p.images[0],
    title: p.name,
    subtitle: p.subtitle ?? "",
    date: "Merchandise",
    venue: "",
    time: "",
    linkTo: `/shop/${p.id}`,
  }));

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        <FrontBanner slides={slides} />

        <Section title="Recommended Events" items={recommendedItems} scrollable />

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
