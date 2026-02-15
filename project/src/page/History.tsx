import { useEffect, useState } from "react";
import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";

type OrderHistory = {
  id: string;
  date: string;
  items: {
    id: string;
    title: string;
    unitPrice: number;
    quantity: number;
  }[];
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
};

export default function History() {
  const [orders, setOrders] = useState<OrderHistory[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("orderHistory");

      if (!raw) {
        setOrders([]);
        return;
      }

      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        setOrders(parsed);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("History error:", error);
      setOrders([]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">
          ประวัติการสั่งซื้อ
        </h1>

        {orders.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-gray-500">
            ยังไม่มีประวัติการสั่งซื้อ
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={order.id ?? index}
              className="bg-white rounded-2xl shadow p-6"
            >
              <div className="flex justify-between mb-4">
                <div>
                  <p className="font-semibold">
                    วันที่: {order.date ?? "-"}
                  </p>
                  <p className="text-sm text-gray-500">
                    รหัสคำสั่งซื้อ: {order.id ?? "-"}
                  </p>
                </div>

                <p className="font-bold text-lg">
                  {(order.total ?? 0).toLocaleString()} บาท
                </p>
              </div>

              {/* รายการสินค้า */}
              <div className="border-t pt-4 space-y-2">
                {Array.isArray(order.items) &&
                  order.items.map((item, i) => (
                    <div
                      key={item.id ?? i}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.title ?? "-"} x{item.quantity ?? 0}
                      </span>
                      <span>
                        {(
                          (item.unitPrice ?? 0) *
                          (item.quantity ?? 0)
                        ).toLocaleString()} บาท
                      </span>
                    </div>
                  ))}
              </div>

              {/* ข้อมูลลูกค้า */}
              <div className="border-t mt-4 pt-4 text-sm text-gray-600">
                <p><strong>ชื่อ:</strong> {order.customer?.name ?? "-"}</p>
                <p><strong>Email:</strong> {order.customer?.email ?? "-"}</p>
                <p><strong>เบอร์:</strong> {order.customer?.phone ?? "-"}</p>
                <p><strong>ที่อยู่:</strong> {order.customer?.address ?? "-"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
