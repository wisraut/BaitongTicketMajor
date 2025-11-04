import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FrontBanner, { type Slide } from "../components/FrontBanner";

const slides: Slide[] = [
  { id: 1, imageUrl: "/ball.jpg", href: "#", title: "บอลสุดมันเเซ่บๆ!" },
  { id: 2, imageUrl: "/concert.png", href: "#", title: "คอนเสริทสุดจําบจ๊วบๆ" },
  {
    id: 3,
    imageUrl: "/shirt.jpg",
    href: "#",
    title: "เสื้อบอลโครตรเฟี้ยวโครตเท่!",
  },
];

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-white text-black">
        <FrontBanner slides={slides} autoPlayMs={4500} />
        <h1>HOME</h1>
        <h1>HOME</h1>
        <h1>HOME</h1>
        <h1>HOME</h1>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
