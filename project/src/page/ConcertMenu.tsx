import { useSearchParams } from "react-router-dom";
import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";
import Section from "../components/useall/Section";
//import Pagination from "../components/useall/Pagination";

import {
  EVENTS as CONCERT_EVENTS,
  type Event,
} from "../data/eventconcert";

function toEventItem(ev: Event) {
  return {
    id: ev.id,
    image: ev.banner,
    title: ev.title,
    subtitle: ev.subtitle,
    date: ev.dateRange,
    time: ev.Time ?? "",
    venue: ev.venue,
    linkTo: `/events/${ev.id}`,
  };
}

export default function ConcertMenuPage() {
  const [params] = useSearchParams();
  const seaching = (params.get("seaching") || "").trim().toLowerCase();

  const filteredEvents = seaching
    ? CONCERT_EVENTS.filter((ev: Event) => {
        const haystack = `${ev.title ?? ""} ${ev.subtitle ?? ""} ${ev.venue ?? ""}`;
        return haystack.toLowerCase().includes(seaching);
      })
    : CONCERT_EVENTS;

  const concertItems = filteredEvents.map(toEventItem);

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen pb-10">
        <Section title="คอนเสิร์ตทั้งหมด" items={concertItems} />
      </main>
      {/* <Pagination /> */}
      <Footer />
    </>
  );
}
