// src/components/Qrcode.tsx (ตามไฟล์เดิม แค่แก้เนื้อข้างใน)

import React from "react";

interface QRCodePopupProps {
  amount: number;
  onClose: () => void;
  onPaid: () => void;   // <<< เพิ่ม callback ตอนกดว่า "จ่ายแล้ว"
}

const QRCodePopup: React.FC<QRCodePopupProps> = ({ amount, onClose, onPaid }) => {
  const promptpayId = "0837951132";
  const qrCodeUrl = `https://promptpay.io/${promptpayId}/${amount}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center relative">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          สแกนเพื่อชำระเงิน
        </h2>

        <img
          src={qrCodeUrl}
          alt="PromptPay QR Code"
          className="w-64 h-64 mx-auto"
        />

        <p className="text-gray-600 mt-2">
          จำนวน: {amount.toLocaleString()} บาท
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={onPaid}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition text-sm"
          >
            ฉันชำระเงินแล้ว
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodePopup;
