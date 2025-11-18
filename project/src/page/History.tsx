// src/page/History.tsx

import { useEffect, useState } from "react";
import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";

type HistoryItem = {
  id: string;
  userEmail: string | null;
  createdAt: string;
  eventId: string;
  eventTitle: string;
  dateRange?: string;
  time?: string;
  venue?: string;
  banner?: string;
  tierName: string;
  price: number;
  quantity: number;
  total: number;
};

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const rawUser = localStorage.getItem("loggedInUser");
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser) as { email?: string };
        setUserEmail(parsed.email ?? null);
      } catch {
        setUserEmail(null);
      }
    }

    const rawHistory = localStorage.getItem("orderHistory");
    if (rawHistory) {
      try {
        const parsed = JSON.parse(rawHistory);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      } catch {
        setItems([]);
      }
    }
  }, []);

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-sm text-slate-600">
            กรุณาเข้าสู่ระบบก่อนเพื่อดูประวัติการสั่งซื้อ
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const myOrders = items.filter((o) => o.userEmail === userEmail);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">
          ประวัติการสั่งซื้อ
        </h1>

        {myOrders.length === 0 ? (
          <p className="text-sm text-slate-600">
            ยังไม่มีประวัติการสั่งซื้อสำหรับบัญชี {userEmail}
          </p>
        ) : (
          <div className="space-y-3">
            {myOrders
              .slice()
              .reverse()
              .map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 flex gap-3"
                >
                  {order.banner && (
                    <img
                      src={order.banner}
                      alt={order.eventTitle}
                      className="hidden sm:block h-20 w-20 rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1 text-sm">
                    <p className="font-semibold text-slate-900">
                      {order.eventTitle}
                    </p>
                    <p className="text-slate-600 text-xs">
                      {order.dateRange} {order.time && `เวลา ${order.time}`}
                    </p>
                    {order.venue && (
                      <p className="text-slate-600 text-xs">
                        สถานที่จัดงาน {order.venue}
                      </p>
                    )}
                    <p className="mt-1 text-slate-700 text-xs">
                      โซน: {order.tierName} | จำนวน: {order.quantity} ใบ
                    </p>
                    <p className="text-slate-900 font-semibold text-sm">
                      ยอดรวม {order.total.toLocaleString()} บาท
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      รหัสออเดอร์ {order.id} | สั่งเมื่อ{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
