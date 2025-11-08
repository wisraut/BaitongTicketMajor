import React from "react";
import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";
import Pagination from "../components/useall/Pagination";
import SectionGrid from "../components/shop/SectionGrid";
import type { Product } from "../components/shop/ProductCard";
import FrontBanner from "../components/useall/FrontBanner";

// สไลด์สำหรับ FrontBanner (ต้องส่ง props นี้)
const slides = [
  { id: 1, imageUrl: "/ball.jpg" },
  { id: 2, imageUrl: "/concert.png" },
  { id: 3, imageUrl: "/concert.png" },
];

// ตัวอย่างข้อมูล (เปลี่ยนเป็นข้อมูลจริงได้)
const img = (seed: string) =>
  `https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop&ixid=${seed}`;

const newArrivals: Product[] = [
  {
    id: "na1",
    title: "Oasis Tour Tee",
    subtitle: "Black",
    price: 1200,
    img: img("1"),
    badge: "New",
  },
  {
    id: "na2",
    title: "Band Socks Pack",
    subtitle: "2 Pairs",
    price: 700,
    img: img("2"),
  },
  { id: "na3", title: "Poster – Limited", price: 1250, img: img("3") },
  { id: "na4", title: "Cap – Embroidery", price: 699, img: img("4") },
  { id: "na5", title: "Canvas Tote", price: 850, img: img("5") },
  { id: "na6", title: "Sticker Set", price: 250, img: img("6") },
  { id: "na7", title: "Keychain Metal", price: 299, img: img("7") },
  { id: "na8", title: "Hoodie World Tour", price: 1990, img: img("8") },
  { id: "na9", title: "Mug – Logo", price: 390, img: img("9") },
  { id: "na10", title: "Badge Pack", price: 180, img: img("10") },
];

const newEvents: Product[] = [
  {
    id: "ne1",
    title: "BLACKPINK – PINK VENOM TOUR T-SHIRT",
    price: 1200,
    img: img("11"),
  },
  {
    id: "ne2",
    title: "Green Day – American Idiot Tee",
    price: 1000,
    img: img("12"),
  },
  { id: "ne3", title: "My Chemical Romance Tee", price: 1000, img: img("13") },
  { id: "ne4", title: "Oasis – Supersonic", price: 1000, img: img("14") },
  { id: "ne5", title: "Rammstein – Band Tee", price: 1000, img: img("15") },
  {
    id: "ne6",
    title: "Metallica – Master of Puppets",
    price: 1200,
    img: img("16"),
  },
  { id: "ne7", title: "AC/DC – Highway to Hell", price: 1000, img: img("17") },
  { id: "ne8", title: "Muse – Simulation Theory", price: 1000, img: img("18") },
  { id: "ne9", title: "The 1975 – Logo Tee", price: 1000, img: img("19") },
  {
    id: "ne10",
    title: "The Strokes – Room on Fire",
    price: 1000,
    img: img("20"),
  },
];

const ShopPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* Header เดิม */}
      <Header />
      <FrontBanner slides={slides} />
      {/* Sections */}
      <SectionGrid title="New Arrivals" items={newArrivals} />
      <SectionGrid title="New Events" items={newEvents} />
      {/* Pagination */}
      <Pagination />
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ShopPage;
