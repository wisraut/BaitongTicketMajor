import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";
import EventCard, { type EventItem } from "../components/home/EventCard";
import { EVENTS as BOXING_EVENTS } from "../data/eventboxing";

function toEventItem(event: any): EventItem {
  return {
    id: event.id,
    image: event.banner,
    title: event.title,
    subtitle: event.subtitle,
    date: event.dateRange,
    venue: event.venue,
    time: event.Time ?? "",
    linkTo: `/events/${event.id}`,
  };
}

function mergeById(base: EventItem[], extra: EventItem[]): EventItem[] {
  const map = new Map<EventItem["id"], EventItem>();
  base.forEach((item) => map.set(item.id, item));
  extra.forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
}

export default function SportMenuPage() {
  const baseItems = BOXING_EVENTS.map(toEventItem);
  const [extraItems, setExtraItems] = useState<EventItem[]>([]);
  const items = mergeById(baseItems, extraItems);

  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(db, "events"), where("type", "==", "sport"));
        const snap = await getDocs(q);
        const fromFs = snap.docs.map((doc) => toEventItem(doc.data()));
        setExtraItems(fromFs);
      } catch (err) {
        console.error("[SportMenu] load error", err);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="mb-4 text-2xl font-bold">Sport Events</h1>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <EventCard key={item.id} item={item} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
