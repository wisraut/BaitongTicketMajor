import React from "react";

export interface QRCodePopupProps {
  amount: number;
  onClose: () => void;
  // เพิ่ม optional onPaid เพื่อให้ Payment.tsx ส่งมาได้
  onPaid?: () => void;
}

const QRCodePopup: React.FC<QRCodePopupProps> = ({
  amount,
  onClose,
  onPaid,
}) => {
  const promptpayId = "0837951132";
  const qrCodeUrl = `https://promptpay.io/${promptpayId}/${amount}`;

  const handlePaidClick = () => {
    // ถ้ามี onPaid ให้เรียกก่อน
    if (onPaid) {
      onPaid();
    }
    // แล้วค่อยปิด popup
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-80 rounded-2xl bg-white p-6 text-center shadow-xl">
        <h2 className="mb-2 text-lg font-semibold text-gray-800">
          สแกนเพื่อชำระเงิน
        </h2>

        <p className="text-sm text-gray-600 mb-3">
          พร้อมเพย์: <span className="font-semibold">{promptpayId}</span>
        </p>

        <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-xl bg-gray-100">
          <img
            src={qrCodeUrl}
            alt="PromptPay QR"
            className="h-40 w-40 rounded-lg object-contain"
          />
        </div>

        <p className="mt-3 text-sm text-gray-700">
          จำนวน:{" "}
          <span className="font-semibold">
            {amount.toLocaleString()} บาท
          </span>
        </p>

        <div className="mt-4 flex justify-center gap-3">
          {/* ปุ่มยืนยันว่าจ่ายแล้ว (เรียก onPaid ถ้ามี) */}
          <button
            type="button"
            onClick={handlePaidClick}
            className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition"
          >
            ชำระเงินแล้ว
          </button>

          {/* ปุ่มปิดเฉย ๆ */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-400 transition"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodePopup;
