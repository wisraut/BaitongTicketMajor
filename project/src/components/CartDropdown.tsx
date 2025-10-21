import React from "react";

interface CartDropdownProps {
  items: { name: string; price: number }[];
  onCheckout: () => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({ items, onCheckout }) => (
  <div className="absolute right-0 mt-3 w-72 rounded-lg border border-slate-700 bg-slate-800 shadow-xl p-3">
    <p className="text-sm font-semibold mb-2">สินค้าในตะกร้า</p>
    <div className="space-y-2 max-h-[200px] overflow-y-auto">
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 text-center">ยังไม่มีสินค้า</p>
      ) : (
        items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span>{item.name}</span>
            <span>฿{item.price}</span>
          </div>
        ))
      )}
    </div>
    <button
      onClick={onCheckout}
      className="mt-3 w-full bg-amber-400 text-slate-900 rounded-md py-1.5 font-semibold hover:bg-amber-300"
    >
      ไปหน้าชำระเงิน
    </button>
  </div>
);

export default CartDropdown;
