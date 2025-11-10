import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";
import Section from "../components/useall/Section";
import Pagination from "../components/useall/Pagination";
import { EVENTS as CONCERT_EVENTS } from "../data/eventconcert";

function toEventItem(ev: any) {
  return {
    id: ev.id,
    image: ev.banner,
    title: ev.title,
    subtitle: ev.subtitle,
    date: ev.dateRange,
    time: ev.Time ?? "",
    venue: ev.venue,
  };
}

export default function ConcertMenu() {
  const concertItems = CONCERT_EVENTS.map(toEventItem);

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen pb-10">
        <Section title="Recommended Events" items={concertItems} />
      </main>
      <Pagination/>
      <Footer />
    </>
  );
}
