import { useEffect, useState } from "react";
import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";
import generatePayload from "promptpay-qr";
import QRCode from "qrcode";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

type CartItem = {
  id: string;
  title: string;
  unitPrice: number;
  quantity: number;
  option?: string;
  image: string; // 🔥 เพิ่มรูป
};

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
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
  qrImage?: string;
};

export default function Payment() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showQR, setShowQR] = useState(false);
  const [qrImage, setQrImage] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});

  const promptPayNumber = "0837951132";

  useEffect(() => {
    const raw = localStorage.getItem("cartItems");
    if (raw) {
      setCartItems(JSON.parse(raw));
    }
  }, []);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!name.trim()) newErrors.name = "กรุณากรอกชื่อ";
    if (!email.includes("@")) newErrors.email = "Email ต้องมี @";
    if (!/^\d{10}$/.test(phone)) newErrors.phone = "เบอร์โทรต้องมี 10 หลัก";
    if (!address.trim()) newErrors.address = "กรุณากรอกที่อยู่";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    const payload = generatePayload(promptPayNumber, {
      amount: totalPrice,
    });

    const qr = await QRCode.toDataURL(payload);
    setQrImage(qr);
    setShowQR(true);
  };

  const handleConfirmPaid = async () => {
    const newOrder: OrderHistory = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      items: cartItems,
      total: totalPrice,
      customer: { name, email, phone, address },
      qrImage,
    };

    // 🔥 Save local ก่อน
    const oldHistory = localStorage.getItem("orderHistory");
    const parsedHistory: OrderHistory[] = oldHistory
      ? JSON.parse(oldHistory)
      : [];

    parsedHistory.push(newOrder);
    localStorage.setItem("orderHistory", JSON.stringify(parsedHistory));

    localStorage.removeItem("cartItems");

    // 🔥 Firestore (ไม่ block หน้า)
    addDoc(collection(db, "orders"), {
      ...newOrder,
      createdAt: serverTimestamp(),
    }).catch((err) => console.error(err));

    window.location.href = "/history";
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">ชำระเงิน</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ฟอร์ม */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow p-6">
            <h2 className="font-semibold mb-4">ข้อมูลผู้ซื้อ</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="ชื่อ-นามสกุล"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}

              <input
                type="text"
                placeholder="เบอร์โทร"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
              {errors.phone && <p className="text-red-500">{errors.phone}</p>}

              <textarea
                placeholder="ที่อยู่จัดส่ง"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
              {errors.address && <p className="text-red-500">{errors.address}</p>}

              <button
                type="button"
                onClick={handlePayment}
                className="mt-4 rounded-full px-6 py-2 text-white bg-[#234C6A]"
              >
                ยืนยันการชำระเงิน
              </button>
            </div>
          </div>

          {/* สรุปรายการ + รูป */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-semibold mb-4">สรุปรายการ</h2>

            {cartItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center justify-between mb-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p>{item.title}</p>
                    <p className="text-sm text-gray-500">
                      x{item.quantity}
                    </p>
                  </div>
                </div>

                <p>
                  {(item.unitPrice * item.quantity).toLocaleString()} บาท
                </p>
              </div>
            ))}

            <div className="border-t pt-4 mt-4 flex justify-between font-semibold">
              <span>ยอดรวมทั้งหมด</span>
              <span>{totalPrice.toLocaleString()} บาท</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Popup QR */}
      {showQR && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-center mb-2">
              ยอดชำระทั้งหมด
            </h2>

            <p className="text-2xl font-bold text-center mb-4">
              {totalPrice.toLocaleString()} บาท
            </p>

            {qrImage && (
              <img
                src={qrImage}
                alt="QR"
                className="mx-auto w-56 h-56"
              />
            )}

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowQR(false)}
                className="px-4 py-2 border rounded-lg"
              >
                ยกเลิก
              </button>

              <button
                type="button"
                onClick={handleConfirmPaid}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                ฉันชำระแล้ว
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
