import EventCard from "./EventCard";
import type { EventItem } from "./EventCard";

const Section: React.FC<{ title: string; items: EventItem[] }> = ({ title, items }) => (
  <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <h2 className="mb-4 text-xl font-semibold text-slate-800 sm:text-2xl">{title}</h2>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((e) => (
        <EventCard key={e.id} item={e} />
      ))}
    </div>
  </section>
);

export default Section;
