import { useEffect, useState } from "react";
import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";

type CartItem = {
  id: string;
  title: string;
  unitPrice: number;
  quantity: number;
  option?: string;
  image: string;
};

type OrderHistory = {
  id: string;
  date: string;
  items: CartItem[];
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
    const raw = localStorage.getItem("orderHistory");
    if (raw) {
      const parsed = JSON.parse(raw);

      // 🔥 เรียงใหม่สุดขึ้นบน
      const sorted = [...parsed].sort(
        (a, b) => Number(b.id) - Number(a.id)
      );

      setOrders(sorted);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">ประวัติการสั่งซื้อ</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            ยังไม่มีประวัติการสั่งซื้อ
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-2xl shadow"
              >
                {/* ข้อมูลคำสั่งซื้อ */}
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="font-semibold">
                      วันที่สั่งซื้อ: {order.date}
                    </p>
                    <p className="text-sm text-gray-500">
                      ผู้สั่งซื้อ: {order.customer.name}
                    </p>
                  </div>

                  <div className="text-right font-semibold">
                    รวม {order.total.toLocaleString()} บาท
                  </div>
                </div>

                {/* รายการสินค้า */}
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center justify-between border rounded-xl p-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />

                        <div>
                          <p className="font-medium">
                            {item.title}
                          </p>
                          {item.option && (
                            <p className="text-sm text-gray-500">
                              ตัวเลือก: {item.option}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            จำนวน: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="font-semibold">
                        {(item.unitPrice * item.quantity).toLocaleString()} บาท
                      </div>
                    </div>
                  ))}
                </div>

                {/* สถานะ */}
                <div className="mt-4 text-sm text-green-600 font-medium">
                  สถานะ: ชำระเงินแล้ว
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
