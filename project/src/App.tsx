import React from "react";
import "./App.css";
import Topbar from "./components/Topbar";
import Footer from "./components/Footer";
import FrontBanner, { type Slide } from "./components/FrontBanner";

const slides: Slide[] = [
  { id: 1, imageUrl: "/ball.jpg", href: "#", title: "บอลสุดมันเเซ่บๆ!" },
  { id: 2, imageUrl: "/concert.png", href: "#", title: "คอนเสริทสุดจําบจ๊วบๆ" },
  { id: 3, imageUrl: "/shirt.jpg", href: "#",  title: "เสื้อบอลโครตรเฟี้ยวโครตเท่!" },
]

function App() {
  return (
    <div className="App">
      <Topbar />
      <main className="flex-1 bg-white text-black">
        <FrontBanner slides={slides} autoPlayMs={4500} />
        <h1>HOME</h1>
        <h1>HOME</h1>
        <h1>HOME</h1>
        <h1>HOME</h1>

        <h1>HOME</h1>
        <h1>HOME</h1>
        <h1>HOME</h1>
        <h1>HOME</h1>v

        <h1>HOME</h1>
        <h1>HOME</h1><h1>HOME</h1>
        <h1>HOME</h1>
        vv
        <h1>HOME</h1>
        <h1>HOME</h1>
        vv
        <h1>HOME</h1>
        <h1>HOME</h1>

        <h1>HOME</h1>
        <h1>HOME</h1>v
        v

        <h1>HOME</h1>
        <h1>HOME</h1>
        <var><h1>HOME</h1>
        <h1>HOME</h1><h1>HOME</h1>
        <h1>HOME</h1></var>
        <h1>HOME</h1>
        <h1>HOME</h1>


      </main>
      <Footer />
    </div>
  );
}

export default App;
