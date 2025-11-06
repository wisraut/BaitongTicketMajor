import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, ChevronDown, X, Search } from "lucide-react";

const MENU_KEYS = ["events", "giftshop", "promo"] as const;
type MenuKeyStrict = (typeof MENU_KEYS)[number];
type MenuKey = MenuKeyStrict | null;

const MENU_SECTIONS: Record<MenuKeyStrict, string[]> = {
  events: ["Concerts", "Sports", "Performing Arts"],
  giftshop: ["T-Shirts", "Merch Bundles"],
  promo: ["Flash Sale", "Season Pass"],
};

const subPath = (group: MenuKeyStrict) => {
  switch (group) {
    case "events":
      return "/events";
    case "giftshop":
      return "/shop";
    case "promo":
      return "/promo";
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
        ${isOpen ? "bg-white/10 text-white ring-1 ring-white/20" : "text-white/90 hover:bg-white/10"}`}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 w-56 rounded-xl border border-white/10 bg-slate-800 p-2 shadow-xl">
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            {items.map((x) => (
              <Link
                key={x}
                to={subPath(me)}
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

export default function Header() {
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="relative z-50 w-full bg-[#234C6A] text-white shadow-md">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* left */}
        <div className="flex items-center gap-6">
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

          <nav ref={navRef} className="hidden lg:flex items-center gap-2">
            <DesktopDrop label="ทุกงานแสดง" openKey={openMenu} me="events" setOpen={setOpenMenu} />
            <DesktopDrop label="GiftShop" openKey={openMenu} me="giftshop" setOpen={setOpenMenu} />
            <DesktopDrop label="Promo" openKey={openMenu} me="promo" setOpen={setOpenMenu} />
          </nav>
        </div>

        {/* right */}
        <div className="flex items-center gap-3">
          <form className="relative hidden md:block">
            <input
              type="search"
              placeholder="ค้นหา…"
              className="w-72 rounded-full bg-white/10 pl-4 pr-10 py-2 text-sm placeholder-white/70 text-white outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white/40"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5 hover:bg-white/10"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          <Link to="/help" className="hidden lg:inline text-sm text-white/90 hover:text-white">
            ช่วยเหลือ
          </Link>

          <Link to="/cart" className="rounded-full p-2 hover:bg-white/10">
            <ShoppingCart className="h-5 w-5" />
          </Link>

          <Link
            to="/login"
            className="hidden lg:flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-sm hover:bg-white/10"
          >
            <User className="h-4 w-4" /> Register / login
          </Link>

          <button
            className="rounded-md p-2 hover:bg-white/10 lg:hidden"
            onClick={() => {
              setOpenMenu(null);
              setMobileOpen((v) => !v);
            }}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* ===== Mobile Menu Overlay ===== */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] lg:hidden">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* panel */}
          <div className="absolute right-0 top-0 h-full w-[78%] max-w-[320px] bg-[#234C6A] shadow-2xl rounded-l-[32px] overflow-y-auto">
            {/* header in panel */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/10">
              <p className="text-base font-semibold text-white">เมนู</p>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-full p-1.5 hover:bg-white/10"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-6">
              {/* sections */}
              <div>
                <p className="text-xs font-semibold tracking-wide text-white/60 mb-2">ทุกงานแสดง</p>
                <div className="space-y-1">
                  {MENU_SECTIONS.events.map((x) => (
                    <Link
                      key={x}
                      to="/events"
                      className="block rounded-lg px-3 py-2 text-sm text-white/95 hover:bg-white/10"
                      onClick={() => setMobileOpen(false)}
                    >
                      {x}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold tracking-wide text-white/60 mb-2">GiftShop</p>
                <div className="space-y-1">
                  {MENU_SECTIONS.giftshop.map((x) => (
                    <Link
                      key={x}
                      to="/shop"
                      className="block rounded-lg px-3 py-2 text-sm text-white/95 hover:bg-white/10"
                      onClick={() => setMobileOpen(false)}
                    >
                      {x}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold tracking-wide text-white/60 mb-2">Promo</p>
                <div className="space-y-1">
                  {MENU_SECTIONS.promo.map((x) => (
                    <Link
                      key={x}
                      to="/promo"
                      className="block rounded-lg px-3 py-2 text-sm text-white/95 hover:bg-white/10"
                      onClick={() => setMobileOpen(false)}
                    >
                      {x}
                    </Link>
                  ))}
                </div>
              </div>

              {/* bottom btn */}
              <div className="pt-2 pb-6">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  <User className="h-4 w-4" />
                  Register / login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
