import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";

type OrderItem = {
  title: string;
  quantity: number;
  unitPrice: number;
};

type Order = {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: Timestamp;
  items: OrderItem[];
};

export default function History() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      const data: Order[] = snap.docs.map((doc) => {
        const orderData = doc.data() as Omit<Order, "id">;
        return {
          id: doc.id,
          ...orderData,
        };
      });

      setOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">ประวัติการสั่งซื้อ</h1>

        {loading && <p>กำลังโหลด...</p>}

        {!loading && orders.length === 0 && (
          <p>ยังไม่มีประวัติการสั่งซื้อ</p>
        )}

        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-2xl shadow mb-6">
            <div className="flex justify-between mb-4">
              <div>
                <p className="font-semibold">{order.orderNumber}</p>
                <p className="text-sm text-gray-500">{order.status}</p>
              </div>
              <div className="font-semibold">
                {order.total.toLocaleString()} บาท
              </div>
            </div>

            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <div>
                  {item.title} x{item.quantity}
                </div>
                <div>
                  {(item.unitPrice * item.quantity).toLocaleString()} บาท
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
