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
  const [showQR, setShowQR] = useState<boolean>(false);
  const [qrImage, setQrImage] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const promptPayNumber = "0837951132";

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cartItems");
      if (!raw) return;

      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        setCartItems(parsed);
      }
    } catch (error) {
      console.error("Cart parse error:", error);
    }
  }, []);

  const totalPrice: number = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) newErrors.name = "กรุณากรอกชื่อ";
    if (!email.includes("@")) newErrors.email = "Email ต้องมี @";
    if (!/^\d{10}$/.test(phone)) newErrors.phone = "เบอร์โทรต้องมี 10 หลัก";
    if (!address.trim()) newErrors.address = "กรุณากรอกที่อยู่";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (): Promise<void> => {
    if (!validateForm()) return;
    if (cartItems.length === 0) return;

    try {
      const payload = generatePayload(promptPayNumber, {
        amount: totalPrice,
      });

      const qr = await QRCode.toDataURL(payload);
      setQrImage(qr);
      setShowQR(true);
    } catch (error) {
      console.error("QR error:", error);
    }
  };

  const handleConfirmPaid = async (): Promise<void> => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const newOrder: OrderHistory = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        items: cartItems,
        total: totalPrice,
        customer: { name, email, phone, address },
        qrImage: qrImage,
      };

      await addDoc(collection(db, "orders"), {
        ...newOrder,
        createdAt: serverTimestamp(),
      });

      const oldHistory = localStorage.getItem("orderHistory");
      let parsedHistory: OrderHistory[] = [];

      if (oldHistory) {
        try {
          const parsed = JSON.parse(oldHistory);
          if (Array.isArray(parsed)) parsedHistory = parsed;
        } catch {
          parsedHistory = [];
        }
      }

      parsedHistory.push(newOrder);
      localStorage.setItem("orderHistory", JSON.stringify(parsedHistory));

      localStorage.removeItem("cartItems");

      setShowQR(false);

      window.location.href = "/";
    } catch (error) {
      console.error("Payment save error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">ชำระเงิน</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl shadow p-6">
            <h2 className="font-semibold mb-4">ข้อมูลผู้ซื้อ</h2>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="ชื่อ-นามสกุล"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="เบอร์โทร"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>

              <div>
                <textarea
                  placeholder="ที่อยู่จัดส่ง"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handlePayment}
                className="mt-4 rounded-full px-6 py-2.5 text-sm font-semibold text-white bg-[#234C6A] hover:bg-[#1d3e56]"
              >
                ยืนยันการชำระเงิน
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-semibold mb-4">สรุปรายการ</h2>

            {cartItems.length === 0 && (
              <p className="text-gray-500 text-sm">ไม่มีสินค้าในตะกร้า</p>
            )}

            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm mb-3">
                <div>
                  <p>{item.title}</p>
                  <p className="text-xs text-gray-500">
                    x{item.quantity}
                  </p>
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

      {showQR && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative z-[10000]">
            <h2 className="text-lg font-semibold text-center mb-2">
              ยอดชำระทั้งหมด
            </h2>

            <p className="text-2xl font-bold text-center mb-4">
              {totalPrice.toLocaleString()} บาท
            </p>

            <div className="text-sm mb-4 space-y-1">
              <p><strong>ชื่อ:</strong> {name}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>เบอร์:</strong> {phone}</p>
              <p><strong>ที่อยู่:</strong> {address}</p>
            </div>

            {qrImage && (
              <img
                src={qrImage}
                alt="PromptPay QR"
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
                disabled={isProcessing}
                onClick={handleConfirmPaid}
                className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
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
