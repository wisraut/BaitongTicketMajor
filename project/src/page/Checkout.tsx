import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";

type CartItem = {
  id: string;
  type: "event" | "product";
  title: string;
  image: string;
  option?: string;
  unitPrice: number;
  quantity: number;
};

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("cartItems");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch (err) {
      console.error("Failed to parse cart items from localStorage", err);
    }
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("ยังไม่มีสินค้าในตะกร้า");
      return;
    }

    if (!fullName || !email || !phone) {
      alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบ");
      return;
    }

    alert("ชำระเงินสำเร็จ ขอบคุณที่ใช้บริการ BaiTongTicket");

    localStorage.removeItem("cartItems");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-xl font-bold text-slate-900">
          ชำระเงิน
        </h1>

        {items.length === 0 ? (
          <p className="text-sm text-slate-600">
            ยังไม่มีสินค้าในตะกร้า กรุณาเลือกสินค้าหรือบัตรจากหน้าอื่นก่อน
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
            {/* ฟอร์มกรอกข้อมูลผู้ซื้อ */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
            >
              <h2 className="text-base font-semibold text-slate-900">
                ข้อมูลผู้ซื้อ
              </h2>

              <div className="space-y-1">
                <label className="block text-sm text-slate-700">
                  ชื่อและนามสกุล
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#234C6A] focus:outline-none focus:ring-1 focus:ring-[#234C6A]"
                  placeholder="เช่น สมชาย ใจดี"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm text-slate-700">
                  อีเมล
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#234C6A] focus:outline-none focus:ring-1 focus:ring-[#234C6A]"
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm text-slate-700">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#234C6A] focus:outline-none focus:ring-1 focus:ring-[#234C6A]"
                  placeholder="เช่น 0812345678"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm text-slate-700">
                  ที่อยู่สำหรับออกใบเสร็จ (ไม่บังคับ)
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#234C6A] focus:outline-none focus:ring-1 focus:ring-[#234C6A]"
                  placeholder="ใส่ที่อยู่ถ้าต้องการใบเสร็จเต็มรูปแบบ"
                />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  วิธีชำระเงิน
                </p>
                <div className="space-y-2 text-sm text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pay"
                      defaultChecked
                      className="h-4 w-4"
                    />
                    โอนผ่าน Mobile Banking
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="pay" className="h-4 w-4" />
                    บัตรเครดิต / เดบิต
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="pay" className="h-4 w-4" />
                    จ่ายปลายทางที่หน้างาน (สำหรับบัตรงานแสดงที่รองรับ)
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-[#234C6A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1c3f55]"
              >
                ยืนยันการชำระเงิน
              </button>
            </form>

            {/* สรุปรายการจากตะกร้า */}
            <aside className="space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 text-sm">
              <h2 className="text-base font-semibold text-slate-900">
                สรุปรายการในตะกร้า
              </h2>

              <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-lg border border-slate-200 p-2"
                  >
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="line-clamp-2 text-[13px] font-medium text-slate-900">
                        {item.title}
                      </p>
                      {item.option && (
                        <p className="text-[12px] text-slate-600">
                          ตัวเลือก: {item.option}
                        </p>
                      )}
                      <p className="text-[12px] text-slate-500">
                        จำนวน {item.quantity} ชิ้น
                      </p>
                      <p className="text-[12px] font-semibold text-slate-900">
                        {(item.unitPrice * item.quantity).toLocaleString()} บาท
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between font-semibold">
                <span>ยอดชำระรวม</span>
                <span>{subtotal.toLocaleString()} บาท</span>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
