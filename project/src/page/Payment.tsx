import { useState, useEffect } from "react";
import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";
import QRCode from "qrcode";

type CartItem = {
  id: string;
  title: string;
  image: string;
  unitPrice: number;
  quantity: number;
};

export default function PaymentPage() {
  const cart: CartItem[] = JSON.parse(
    localStorage.getItem("cart") || "[]"
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [qrImage, setQrImage] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
  }>({});

  const total = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "กรุณากรอกชื่อ";
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      newErrors.phone = "เบอร์โทรต้องเป็นตัวเลข 10 หลัก";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    if (!address.trim()) {
      newErrors.address = "กรุณากรอกที่อยู่";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const crc16 = (input: string) => {
    let crc = 0xffff;
    for (let i = 0; i < input.length; i++) {
      crc ^= input.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc =
          crc & 0x8000
            ? (crc << 1) ^ 0x1021
            : crc << 1;
      }
    }
    return (crc & 0xffff)
      .toString(16)
      .toUpperCase()
      .padStart(4, "0");
  };

  const generatePromptPayPayload = (
    phoneNumber: string,
    amount: number
  ) => {
    const formattedPhone =
      "0066" + phoneNumber.substring(1);

    const amountStr = amount.toFixed(2);

    const payloadWithoutCRC =
      "000201010211" +
      "29370016A000000677010111" +
      "011300" +
      formattedPhone.length +
      formattedPhone +
      "5303764" +
      "54" +
      amountStr.length
        .toString()
        .padStart(2, "0") +
      amountStr +
      "5802TH6304";

    const crc = crc16(payloadWithoutCRC);
    return payloadWithoutCRC + crc;
  };

  const promptPayPayload = generatePromptPayPayload(
    "0837951132",
    total
  );

  const handleConfirmPayment = () => {
    if (!validate()) return;
    setShowQR(true);
  };

  useEffect(() => {
    if (showQR) {
      QRCode.toDataURL(promptPayPayload).then((url) => {
        setQrImage(url);
      });
    }
  }, [showQR]);

  const handleFinishPayment = () => {
    const history =
      JSON.parse(localStorage.getItem("history") || "[]");

    const newOrder = {
      id: Date.now(),
      name,
      phone,
      email,
      address,
      total,
      cart,
      date: new Date().toLocaleString(),
    };

    history.push(newOrder);
    localStorage.setItem("history", JSON.stringify(history));

    localStorage.removeItem("cart");

    window.location.href = "/history";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        <h1 className="text-2xl font-bold">
          ชำระเงิน
        </h1>

        {!showQR && (
          <>
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="ชื่อ - นามสกุล"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="เบอร์โทร"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="อีเมล"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <textarea
                  placeholder="ที่อยู่"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  rows={3}
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.address}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 space-y-4">
              <h2 className="font-semibold">
                สรุปรายการ
              </h2>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border p-3 rounded-lg"
                >
                  <div className="h-14 w-14 overflow-hidden rounded-md bg-slate-100">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-600">
                      จำนวน {item.quantity}
                    </p>
                  </div>

                  <div className="text-sm font-semibold">
                    {(item.unitPrice *
                      item.quantity
                    ).toLocaleString()}{" "}
                    บาท
                  </div>
                </div>
              ))}

              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>ยอดรวม</span>
                <span>
                  {total.toLocaleString()} บาท
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              className="w-full rounded-full bg-[#234C6A] px-4 py-3 text-white font-semibold"
            >
              ยืนยันชำระเงิน
            </button>
          </>
        )}

        {showQR && (
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 space-y-6 text-center">
            <h2 className="text-lg font-semibold">
              สแกนเพื่อชำระเงิน (PromptPay)
            </h2>

            {qrImage && (
              <img
                src={qrImage}
                alt="PromptPay QR"
                className="mx-auto"
              />
            )}

            <div className="text-left text-sm space-y-1">
              <p><strong>ชื่อ:</strong> {name}</p>
              <p><strong>เบอร์:</strong> {phone}</p>
              <p><strong>อีเมล:</strong> {email}</p>
              <p><strong>ที่อยู่:</strong> {address}</p>
              <p><strong>ยอดชำระ:</strong> {total.toLocaleString()} บาท</p>
            </div>

            <button
              onClick={handleFinishPayment}
              className="w-full rounded-full bg-green-600 px-4 py-3 text-white font-semibold"
            >
              ชำระเงินเรียบร้อย
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
