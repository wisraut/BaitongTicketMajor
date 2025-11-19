import React from "react";

type QRCodePopupProps = {
  amount: number;
  onClose: () => void;
  onPaid: () => void; // เรียกตอนกด "ชำระเงินแล้ว"
};

const Qrcode: React.FC<QRCodePopupProps> = ({amount,onClose,onPaid,}) => {
  const promptpayId = "0837951132"; // ไอดีพร้อมเพย์จำลอง
  const qrCodeUrl = `https://promptpay.io/${promptpayId}/${amount}`;
  const formattedAmount = amount.toLocaleString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 text-slate-900 shadow-2xl">
        <h2 className="mb-3 text-center text-base font-semibold">
          สแกนเพื่อชำระเงิน
        </h2>

        <div className="mb-3 text-center text-xs text-slate-600">
          พร้อมเพย์: <span className="font-semibold">{promptpayId}</span>
        </div>

        <div className="mb-4 flex justify-center">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <img
              src={qrCodeUrl}
              alt="PromptPay QR"
              className="h-48 w-48 rounded-lg bg-white"
            />
          </div>
        </div>

        <p className="mb-4 text-center text-sm text-slate-700">
          จำนวน:{" "}
          <span className="font-semibold">
            {formattedAmount} บาท
          </span>
        </p>

        <div className="flex justify-center gap-3 text-sm">
          <button
            type="button"
            onClick={onPaid}
            className="rounded-full bg-[#f59e0b] px-4 py-1.5 font-semibold text-white hover:bg-[#d97706]"
          >
            ชำระเงินแล้ว
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 px-4 py-1.5 text-slate-700 hover:bg-slate-100"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

export default Qrcode;
