import React from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FrontBanner, { Slide } from "./components/FrontBanner";

const slides: Slide[] = [
  { id: 1, imageUrl: "/banners/1.jpg", href: "/event/1", title: "คอนเสิร์ตใหญ่!" },
  { id: 2, imageUrl: "/banners/2.jpg", href: "/movie/2", title: "หนังเข้าใหม่" },
  { id: 3, imageUrl: "/banners/3.jpg", href: "/promo",  title: "โปรโมชันพิเศษ" },
]

function App() {
  return (
    <div className="App">
      <Header />
      <main className="flex-1 bg-white text-black">
        <FrontBanner slides={slides} autoPlayMs={4500} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
