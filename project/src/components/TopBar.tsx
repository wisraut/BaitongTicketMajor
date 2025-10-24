// src/components/TopBar.tsx
import { useEffect, useRef, useState } from "react";
import { ShoppingCart, User, Menu, ChevronDown, X } from "lucide-react";
import logo from "../assets/logo.png";

/** คีย์เมนูที่ไม่รวม null (ใช้กับ Record/การ index) */
const MENU_KEYS = ["events", "giftshop", "promo"] as const;
type MenuKeyStrict = typeof MENU_KEYS[number]; // "events" | "giftshop" | "promo"
type MenuKey = MenuKeyStrict | null; // สำหรับ state (อนุญาต null)

/** รายการเมนูย่อยของแต่ละหมวด */
const MENU_SECTIONS: Record<MenuKeyStrict, string[]> = {
  events: ["All Events", "Concerts", "Sports", "Performing Arts", "Exhibitions"],
  giftshop: ["T-Shirts", "Caps", "Posters", "Souvenirs", "Merch Bundles"],
  promo: ["Discount Tickets", "Early Bird", "Flash Sale", "Season Pass", "Combo Deals"],
};

/** ประเภทสินค้าในตะกร้า */
interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

/** Dropdown สำหรับ Desktop (เปิดทีละอัน + ค้างไว้ได้) */
const DesktopDrop: React.FC<{
  label: string;
  openKey: MenuKey;          // อันที่เปิดอยู่ (รวม null)
  me: MenuKeyStrict;         // คีย์ของตัวเอง (ไม่เป็น null)
  setOpen: (k: MenuKey) => void;
}> = ({ label, openKey, me, setOpen }) => {
  const isOpen = openKey === me;
  const items = MENU_SECTIONS[me];

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(me)}      // เปิดเมื่อโฮเวอร์
      // ❌ ไม่ปิดด้วย onMouseLeave เพื่อให้ลากลงไปที่แผงได้
    >
      <button
        type="button"
        onClick={() => setOpen(isOpen ? null : me)} // คลิกสลับ เปิด/ปิด
        className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition
                    ${isOpen ? "bg-white/10 text-white ring-1 ring-white/20" : "text-white/90 hover:bg-white/10"}`}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 w-56 rounded-xl border border-white/10 bg-slate-800 p-2 shadow-xl">
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            {items.map((x: string) => (
              <a
                key={x}
                href="#"
                className="block rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(null)} // เลือกแล้วปิด
              >
                {x}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


const TopBar: React.FC = () => {
  // เดสก์ท็อป: เปิดทีละอัน
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  // มือถือ: hamburger
  const [mobileOpen, setMobileOpen] = useState(false);

  // ตะกร้า
  const [cartOpen, setCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  // ตัวอย่างสินค้าในตะกร้า (ภายหลังสามารถโยงมาจาก Context/Redux ได้)
  const [cartItems] = useState<CartItem[]>([
    { id: "t1", name: "ONE Fight Night 27 – Zone A", price: 1800, qty: 2 },
    { id: "g1", name: "Poster Limited", price: 350, qty: 1 },
  ]);

  const navRef = useRef<HTMLDivElement>(null);

  // ปิดเมนู/ตะกร้าเมื่อคลิกนอก/กด ESC/เลื่อนหน้า
  useEffect(() => {
    const onDocClick = (e: globalThis.MouseEvent) => {
      const el = e.target as Node;
      const clickedOutsideNav = navRef.current && !navRef.current.contains(el);
      const clickedOutsideCart = cartRef.current && !cartRef.current.contains(el);

      // ถ้าคลิกนอกทั้งสองบริเวณ ให้ปิดทั้งคู่
      if (clickedOutsideNav) setOpenMenu(null);
      if (clickedOutsideCart) setCartOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
        setCartOpen(false);
      }
    };

    const onScroll = () => {
      setOpenMenu(null);
      setCartOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // ล็อกสกอร์ลของ body ตอนเปิดเมนูมือถือ
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const goHome = () => (window.location.href = "/");
  const cartCount = cartItems.reduce((sum, it) => sum + it.qty, 0);
  const cartTotal = cartItems.reduce((sum, it) => sum + it.price * it.qty, 0);

  return (
    <header className="w-full border-b border-slate-800 bg-slate-900 text-white">
      <div className="w-full">
        <div className="flex items-center justify-between py-4">
          {/* ซ้าย: โลโก้ + เมนูเดสก์ท็อป */}
          <div className="flex items-center gap-6 pl-4 sm:pl-6 lg:pl-8">
            <button
              type="button"
              onClick={goHome}
              className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
              style={{ lineHeight: 0 }}
            >
              <img src={logo} alt="BaiTongTicket" className="block w-auto max-h-16 shrink-0" />
            </button>

            <nav ref={navRef} className="hidden items-center gap-2 lg:flex">
              <DesktopDrop label="ทุกงานแสดง" openKey={openMenu} me="events" setOpen={setOpenMenu} />
              <DesktopDrop label="Giftshop" openKey={openMenu} me="giftshop" setOpen={setOpenMenu} />
              <DesktopDrop label="Promo" openKey={openMenu} me="promo" setOpen={setOpenMenu} />
            </nav>
          </div>

          {/* ขวา: actions + cart + hamburger */}
          <div className="flex items-center gap-3 pr-4 sm:pr-6 lg:pr-8">
            <a href="#" className="hidden text-sm text-white/80 hover:text-white lg:inline">
              ช่วยเหลือ
            </a>

            {/* CART */}
            <div className="relative" ref={cartRef}>
              <button
                type="button"
                onClick={() => setCartOpen((v) => !v)}
                className="relative rounded-full p-2 hover:bg-white/10"
                aria-label="Open cart"
                aria-expanded={cartOpen}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[18px] items-center justify-center rounded-full bg-amber-400 px-1.5 text-xs font-semibold text-slate-900">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {cartOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-lg border border-slate-700 bg-slate-800 shadow-xl">
                  <div className="px-4 py-3 border-b border-slate-700">
                    <p className="text-sm font-semibold">สินค้าในตะกร้า</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto px-4 py-2 space-y-2">
                    {cartItems.length === 0 ? (
                      <p className="text-sm text-slate-400 py-4 text-center">ยังไม่มีสินค้า</p>
                    ) : (
                      cartItems.map((it: CartItem) => (
                        <div key={it.id} className="flex items-start justify-between gap-3 rounded-md p-2 hover:bg-white/5">
                          <div className="text-sm leading-5">
                            <div className="font-medium text-white/90">{it.name}</div>
                            <div className="text-white/60">x{it.qty}</div>
                          </div>
                          <div className="text-sm font-semibold text-white/90">
                            ฿{(it.price * it.qty).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">
                    <span className="text-sm text-white/70">ยอดรวม</span>
                    <span className="text-base font-bold">฿{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="p-3 flex gap-2">
                    <button
                      className="w-1/2 rounded-md border border-white/20 px-3 py-2 text-sm text-white hover:bg-white/10"
                      onClick={() => setCartOpen(false)}
                    >
                      ดูตะกร้า
                    </button>
                    <button
                      className="w-1/2 rounded-md bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300"
                      onClick={() => (window.location.href = "/checkout")}
                    >
                      ชำระเงิน
                    </button>
                  </div>
                </div>
              )}
            </div>

            <a
              href="#"
              className="hidden items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-sm hover:bg-white/10 lg:flex"
            >
              <User className="h-4 w-4" /> Register / login
            </a>

            <button
              className="rounded-md p-2 hover:bg-white/10 lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => {
                setOpenMenu(null);
                setCartOpen(false);
                setMobileOpen((v) => !v);
              }}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* เมนูมือถือ — กล่องในเลื่อนเองได้ */}
      <div
        className={`lg:hidden z-50 border-t border-gray-200 bg-white shadow-lg
                    transition-[max-height,opacity] duration-300 ease-out overflow-hidden
                    ${mobileOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-4 py-4 space-y-4 max-h-[66vh] overflow-y-auto overscroll-contain">
          {MENU_KEYS.map((key: MenuKeyStrict) => (
            <div key={key}>
              <p className="mb-1 text-sm font-semibold text-slate-500">
                {key === "events" ? "ทุกงานแสดง" : key === "giftshop" ? "Giftshop" : "Promo"}
              </p>
              {MENU_SECTIONS[key].map((x: string) => (
                <a
                  key={`${key}-${x}`}
                  href="#"
                  className="block rounded-lg px-3 py-2 text-base text-slate-800 hover:bg-slate-100"
                  onClick={() => setMobileOpen(false)}
                >
                  {x}
                </a>
              ))}
            </div>
          ))}

          <div className="pt-2">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-800 hover:bg-slate-100"
              onClick={() => setMobileOpen(false)}
            >
              <User className="h-4 w-4" /> Register / login
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
