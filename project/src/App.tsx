import { Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import Shop from "./page/Shop";
import Login from "./page/Login";

export default function App() {
  return (
    // ให้แต่ละหน้า render ตัว Header/Footer ของตัวเองไปเลย
    // เพราะในไฟล์หน้า แต่ละหน้าคุณเรียก Header/Footer ไว้แล้ว
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/login" element={<Login />} />

      {/* เส้นทางที่ header ของคุณลิงก์ไว้เผื่ออนาคต */}
      <Route path="/events" element={<div className="p-6">Events page</div>} />
      <Route path="/promo" element={<div className="p-6">Promo page</div>} />
      <Route path="/cart" element={<div className="p-6">Cart page</div>} />
      <Route path="/help" element={<div className="p-6">Help page</div>} />
    </Routes>
  );
}
