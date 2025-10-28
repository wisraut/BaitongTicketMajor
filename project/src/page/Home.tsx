import Header from "../components/Header";
import Banner from "../components/Banner";
import Section from "../components/Section";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import type { EventItem } from "../components/EventCard";
import FrontBanner, { type Slide } from "../components/FrontBanner";

const slides: Slide[] = [
  { id: 1, imageUrl: "/ball.jpg", href: "#", title: "บอลสุดมันเเซ่บๆ!" },
  { id: 2, imageUrl: "/concert.png", href: "#", title: "คอนเสริทสุดจําบจ๊วบๆ" },
  { id: 3, imageUrl: "/shirt.jpg", href: "#",  title: "เสื้อบอลโครตรเฟี้ยวโครตเท่!" },
]

const recommended: EventItem[] = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
  title: "ONE Fight Night 27",
  subtitle: "Petchyindee vs Abdiev",
  date: "Sat Nov 9",
  time: "19:30",
  venue: "ONE LUMPINEE",
  badge: i % 3 === 0 ? "Hot" : undefined,
}));

const newEvents: EventItem[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 101,
  image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1600&auto=format&fit=crop",
  title: i % 2 ? "Kenzilla & Abdiev" : "3wsa Championship",
  subtitle: i % 2 ? "Live at Lumpinee" : "Final Round",
  date: i % 2 ? "Sat Oct 5" : "Fri Oct 4",
  time: "19:30",
  venue: "ONE LUMPINEE",
  badge: i % 4 === 0 ? "New" : undefined,
}));

export default function BaiTongTicketPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        <FrontBanner slides={slides} autoPlayMs={4500}/>
        <Section title="Recommended Events" items={recommended} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <hr className="my-6 border-slate-200" />
        </div>
        <Section title="New Events" items={newEvents} />
        <Pagination />
      </main>
      <Footer />
    </div>
  );
}
