import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";
import { useEffect, useState } from "react";

type CartItem = {
  id: string;
  type: "event" | "product";
  title: string;
  image: string;
  option?: string;
  unitPrice: number;
  quantity: number;
  eventdate?: string;
  eventlocation?: string;
  eventtime?: string;
};

type OrderHistoryItem = {
  id: string;
  email: string;
  type: "event" | "product" | "mixed";
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  buyerName?: string;
  contactEmail?: string;
  phone?: string;
  paymentMethod?: string;
};

type LoggedInUser = {
  name?: string;
  email?: string;
  uid?: string;
};

const HISTORY_KEY = "orderHistory";

export default function HistoryPage() {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);

  // โหลดข้อมูลผู้ใช้ที่ล็อกอิน
  useEffect(() => {
    const rawUser = localStorage.getItem("loggedInUser");
    if (!rawUser) return;
    try {
      const parsed = JSON.parse(rawUser) as LoggedInUser;
      setUser(parsed);
    } catch {
      setUser(null);
    }
  }, []);

  // โหลดประวัติคำสั่งซื้อ
  useEffect(() => {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as OrderHistoryItem[];
      if (Array.isArray(parsed)) {
        setOrders(parsed);
      }
    } catch {
      setOrders([]);
    }
  }, []);

  const userEmail = (user?.email ?? "").toLowerCase();
  const myOrders = orders.filter(
    (o) => o.email.toLowerCase() === userEmail && userEmail !== ""
  );

  const sortedOrders = [...myOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header />
      {/* full width ของ viewport เหลือ padding รอบ ๆ */}
      <main className="flex-1 w-full px-3 sm:px-6 lg:px-10 py-8">
        <h1 className="mb-4 text-xl font-bold text-slate-900">
          ประวัติการสั่งซื้อ
        </h1>

        {!userEmail && (
          <p className="text-sm text-slate-600">
            กรุณาเข้าสู่ระบบเพื่อดูประวัติการสั่งซื้อ
          </p>
        )}

        {userEmail && sortedOrders.length === 0 && (
          <p className="text-sm text-slate-600">
            ยังไม่มีประวัติการสั่งซื้อสำหรับอีเมล {userEmail}
          </p>
        )}

        {userEmail && sortedOrders.length > 0 && (
          <div className="space-y-5">
            {sortedOrders.map((order) => (
              <div
                key={order.id}
                className="w-full rounded-xl bg-white px-4 sm:px-6 py-3 sm:py-4 shadow-sm ring-1 ring-slate-200 text-sm"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-900">
                      คำสั่งซื้อ #{order.id}
                    </p>
                    <p className="text-xs text-slate-500">
                      วันที่สั่งซื้อ:{" "}
                      {new Date(order.createdAt).toLocaleString("th-TH")}
                    </p>
                    {order.buyerName && (
                      <p className="text-xs text-slate-500">
                        ผู้ซื้อ: {order.buyerName}
                      </p>
                    )}
                    {order.paymentMethod && (
                      <p className="text-xs text-slate-500">
                        วิธีชำระเงิน: {order.paymentMethod}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">ยอดรวม</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {order.totalAmount.toLocaleString()} บาท
                    </p>
                  </div>
                </div>

                <div className="mt-3 border-t border-slate-200 pt-2 space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      className="flex gap-3 rounded-lg bg-slate-50/70 px-2 py-2 sm:px-3"
                    >
                      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className="font-medium text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          ประเภท: {item.type === "event" ? "งานแสดง" : "สินค้า"}
                        </p>
                        {item.option && (
                          <p className="text-xs text-slate-500">
                            ตัวเลือก: {item.option}
                          </p>
                        )}

                        {item.type === "event" &&
                          (item.eventdate ||
                            item.eventlocation ||
                            item.eventtime) && (
                            <p className="text-xs text-slate-500">
                              {item.eventdate && (
                                <>วันที่แสดง: {item.eventdate} </>
                              )}
                              {item.eventtime && <>เวลา: {item.eventtime} </>}
                              {item.eventlocation && (
                                <>สถานที่: {item.eventlocation}</>
                              )}
                            </p>
                          )}

                        <p className="text-xs text-slate-600">
                          จำนวน {item.quantity} ×{" "}
                          {item.unitPrice.toLocaleString()} บาท
                        </p>
                      </div>
                    </div>
                  ))}
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
