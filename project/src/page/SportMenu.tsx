import Section from "../components/base/Section";
import Footer from "../components/base/Footer";
import Header from "../components/base/Header";
import type { EventItem } from "../components/home/EventCard";
import { EVENTS as SPORTS_EVENTS,
        type Event as SportEvent, 
      } from "../data/eventboxing";

function toEventItem(event: SportEvent): EventItem {
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

export default function SportMenuPage() {
  const sportItems = SPORTS_EVENTS.map(toEventItem);
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        <Section title="Sport Events" items={sportItems} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <hr className="my-6 border-slate-200" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
