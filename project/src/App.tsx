import { Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import Shop from "./page/Shop";
import Login from "./page/LoginAndReg";
import EventDetail from "./page/EventDetail";
import ConcertMenuPage from "./page/ConcertMenu";
import SportMenuPage from "./page/SportMenu";
import PerformanceMenuPage from "./page/PerformanceMenu";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/sports" element={<SportMenuPage />} />
      <Route path="/performance" element={<PerformanceMenuPage />} />
      <Route path="/concerts" element={<ConcertMenuPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/events" element={<div className="p-6">Events page</div>} />
      <Route path="/promo" element={<div className="p-6">Promo page</div>} />
      <Route path="/cart" element={<div className="p-6">Cart page</div>} />
      <Route path="/help" element={<div className="p-6">Help page</div>} />
      <Route path="/events/:id" element={<EventDetail />} />
    </Routes>
  );
}
