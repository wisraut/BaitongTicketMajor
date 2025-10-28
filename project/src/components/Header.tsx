// src/components/Header.tsx
import { useEffect, useRef, useState } from "react";
import { ShoppingCart, User, Menu, ChevronDown, X, Search } from "lucide-react";
import logo from "/logo.png";


// เมนูหลักและเมนูย่อย
const MENU_KEYS = ["events", "giftshop", "promo"] as const;
type MenuKeyStrict = typeof MENU_KEYS[number]; 
type MenuKey = MenuKeyStrict | null;      

const MENU_SECTIONS: Record<MenuKeyStrict, string[]> = {
  events: ["Concerts", "Sports", "Performing Arts"],
  giftshop: ["T-Shirts","Merch Bundles"],
  promo: ["Flash Sale", "Season Pass"],
};


const DesktopDrop: React.FC<{
  label: string;
  openKey: MenuKey;
  me: MenuKeyStrict;
  setOpen: (k: MenuKey) => void;
}> = ({ label, openKey, me, setOpen }) => {
  const isOpen = openKey === me;
  const items = MENU_SECTIONS[me];

  return (
    <div className="relative" onMouseEnter={() => setOpen(me)}>
      <button
        type="button"
        onClick={() => setOpen(isOpen ? null : me)}
        className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition
        ${isOpen ? "bg-white/10 text-white ring-1 ring-white/20" : "text-white/90 hover:bg-white/10"}`}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 w-56 rounded-xl border border-white/10 bg-slate-800 p-2 shadow-xl">
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            {items.map((x) => (
              <a
                key={x}
                href="#"
                className="block rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(null)}
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

// =============== HEADER ===============
export default function Header() {
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (navRef.current && !navRef.current.contains(t)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    const onScroll = () => setOpenMenu(null);

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const goHome = () => (window.location.href = "/");

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full bg-[#234C6A] text-white shadow-md">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={goHome}
            className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"          >
            <img src="./logo.png" alt="BaiTongTicket" className="block w-auto max-h-12 sm:max-h-20 md:max-h-20" />
          </button>

          <nav ref={navRef} className="hidden lg:flex items-center gap-2">
            <DesktopDrop label="ทุกงานแสดง" openKey={openMenu} me="events" setOpen={setOpenMenu} />
            <DesktopDrop label="GiftShop" openKey={openMenu} me="giftshop" setOpen={setOpenMenu} />
            <DesktopDrop label="Promo" openKey={openMenu} me="promo" setOpen={setOpenMenu} />
          </nav>
        </div>

        {/* right: search + help + cart link + login + hamburger */}
        <div className="flex items-center gap-3">
          <form className="relative hidden md:block">
            <input
              type="search"
              placeholder="ค้นหา…"
              className="w-72 rounded-full bg-white/10 pl-4 pr-10 py-2 text-sm placeholder-white/70
                         text-white outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white/40"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5 hover:bg-white/10"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          <a href="#" className="hidden lg:inline text-sm text-white/90 hover:text-white">
            ช่วยเหลือ
          </a>

          {/* cart (link to page) */}
          <a href="/cart" aria-label="Cart" className="rounded-full p-2 hover:bg-white/10">
            <ShoppingCart className="h-5 w-5" />
          </a>

          <a
            href="#"
            className="hidden lg:flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-sm hover:bg-white/10"
          >
            <User className="h-4 w-4" /> Register / login
          </a>

          <button
            className="rounded-md p-2 hover:bg-white/10 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => {
              setOpenMenu(null);
              setMobileOpen((v) => !v);
            }}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU*/}
      <div
        className={`lg:hidden border-t border-white/10 bg-[#234C6A] shadow-lg
                    transition-[max-height,opacity] duration-300 ease-out overflow-hidden
                    ${mobileOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-4 py-4 space-y-4 max-h-[66vh] overflow-y-auto overscroll-contain">
          {MENU_KEYS.map((key) => (
            <div key={key}>
              <p className="mb-1 text-sm font-semibold text-white/80">
                {key === "events" ? "ทุกงานแสดง" : key === "giftshop" ? "GiftShop" : "Promo"}
              </p>
              {MENU_SECTIONS[key].map((x) => (
                <a
                  key={`${key}-${x}`}
                  href="#"
                  className="block rounded-lg px-3 py-2 text-base hover:bg-white/10"
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
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
              onClick={() => setMobileOpen(false)}
            >
              <User className="h-4 w-4" /> Register / login
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}