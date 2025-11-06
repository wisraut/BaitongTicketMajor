// src/components/Header.tsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, ChevronDown, X, Search } from "lucide-react";

// เมนูหลักและเมนูย่อย
const MENU_KEYS = ["events", "giftshop", "promo"] as const;
type MenuKeyStrict = (typeof MENU_KEYS)[number];
type MenuKey = MenuKeyStrict | null;

const MENU_SECTIONS: Record<MenuKeyStrict, string[]> = {
  events: ["Concerts", "Sports", "Performing Arts"],
  giftshop: ["T-Shirts", "Merch Bundles"],
  promo: ["Flash Sale", "Season Pass"],
};

// helper แปลงชื่อเมนูย่อยให้เป็น path คร่าว ๆ
const subPath = (group: MenuKeyStrict, item: string) => {
  switch (group) {
    case "events":
      return "/events";
    case "giftshop":
      return "/shop";
    case "promo":
      return "/promo";
    default:
      return "/";
  }
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
        ${
          isOpen
            ? "bg-white/10 text-white ring-1 ring-white/20"
            : "text-white/90 hover:bg-white/10"
        }`}
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 w-56 rounded-xl border border-white/10 bg-slate-800 p-2 shadow-xl">
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            {items.map((x) => (
              <Link
                key={x}
                to={subPath(me, x)}
                className="block rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(null)}
              >
                {x}
              </Link>
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

  return (
    <header className="flex inset-x-0 w-full bg-[#234C6A] text-white shadow-md">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 w-full">
        <div className="flex items-center gap-6">
          {/* โลโก้ → กลับ home */}
          <Link
            to="/"
            className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
          >
            <img
              src="./logo.png"
              alt="BaiTongTicket"
              className="block w-auto max-h-12 sm:max-h-20 md:max-h-20"
            />
          </Link>

          {/* desktop nav */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-2">
            <DesktopDrop
              label="ทุกงานแสดง"
              openKey={openMenu}
              me="events"
              setOpen={setOpenMenu}
            />
            <DesktopDrop
              label="GiftShop"
              openKey={openMenu}
              me="giftshop"
              setOpen={setOpenMenu}
            />
            <DesktopDrop
              label="Promo"
              openKey={openMenu}
              me="promo"
              setOpen={setOpenMenu}
            />
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

          <Link
            to="/help"
            className="hidden lg:inline text-sm text-white/90 hover:text-white"
          >
            ช่วยเหลือ
          </Link>

          {/* cart */}
          <Link to="/cart" aria-label="Cart" className="rounded-full p-2 hover:bg-white/10">
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {/* login */}
          <Link
            to="/login"
            className="hidden lg:flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-sm hover:bg-white/10"
          >
            <User className="h-4 w-4" /> Register / login
          </Link>

          {/* mobile btn */}
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
                {key === "events"
                  ? "ทุกงานแสดง"
                  : key === "giftshop"
                  ? "GiftShop"
                  : "Promo"}
              </p>
              {MENU_SECTIONS[key].map((x) => (
                <Link
                  key={`${key}-${x}`}
                  to={subPath(key, x)}
                  className="block rounded-lg px-3 py-2 text-base hover:bg-white/10"
                  onClick={() => setMobileOpen(false)}
                >
                  {x}
                </Link>
              ))}
            </div>
          ))}

          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
              onClick={() => setMobileOpen(false)}
            >
              <User className="h-4 w-4" /> Register / login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
