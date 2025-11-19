import { Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import Login from "./page/LoginAndReg";
import EventDetail from "./page/EventDetail";
import ShopDetail from "./page/ShopDetail";
import ConcertMenuPage from "./page/ConcertMenu";
import SportMenuPage from "./page/SportMenu";
import PerformanceMenuPage from "./page/PerformanceMenu";
import PaymentPage from "./page/Payment";
import CartPage from "./page/Cart";
import CheckoutPage from "./page/Checkout";
import ShopMenuPage from "./page/SportMenu";
import AdminPage from "./page/Admin";
import RequireAdmin from "./route/RequireAdmin";
import HistoryPage from "./page/History";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop/:id" element={<ShopDetail />} />
      <Route path="/sports" element={<SportMenuPage />} />
      <Route path="/performance" element={<PerformanceMenuPage />} />
      <Route path="/concerts" element={<ConcertMenuPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/events" element={<div className="p-6">Events page</div>} />
      <Route path="/promo" element={<div className="p-6">Promo page</div>} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/help" element={<div className="p-6">Help page</div>} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/shop" element={<ShopMenuPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminPage />
          </RequireAdmin>
        }
      />
    </Routes>
  );
}
