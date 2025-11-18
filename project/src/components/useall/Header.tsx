import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Menu,
  ChevronDown,
  X,
  Search,
  LogOut,
} from "lucide-react";

const HeaderKey = ["events", "giftshop", "promo"] as const;
type HeaderKey = (typeof HeaderKey)[number];
type is_Headerkey = HeaderKey | null;

const MENU_SECTIONS: Record<HeaderKey, { label: string; to: string }[]> = {
  events: [
    { label: "Concerts", to: "/concerts" },
    { label: "Sports", to: "/sports" },
    { label: "Performing Arts", to: "/performance" },
  ],
  giftshop: [{ label: "Gift", to: "/shop/giftshop" }],
  promo: [{ label: "Flash Sale", to: "/promo/flash" }],
};

const TopDrop: React.FC<{
  label: string;
  openKey: is_Headerkey;
  me: HeaderKey;
  setOpen: (k: is_Headerkey) => void;
}> = ({ label, openKey, me, setOpen }) => {
  const isOpen = openKey === me;
  const items = MENU_SECTIONS[me];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(isOpen ? null : me)}
        onMouseEnter={() => setOpen(me)}
        className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition
        ${
          isOpen
            ? "bg-white/10 text-white ring-1 ring-white/40"
            : "text-white/90 hover:bg-white/10"
        }`}
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/10 bg-slate-800 p-2 shadow-xl"
          onMouseEnter={() => setOpen(me)}
        >
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(null)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Header() {
  const [openMenu, setOpenMenu] = useState<is_Headerkey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [seaching, setSeaching] = useState("");

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = seaching.trim();
    const currentPath = location.pathname || "/";

    if (!q) {
      navigate(currentPath);
      return;
    }

    navigate(`${currentPath}?seaching=${encodeURIComponent(q)}`);
  };

  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    uid?: string;
  } | null>(null);

  const navRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem("loggedInUser");
    if (!raw) {
      setUser(null);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as {
        name?: string;
        email?: string;
        uid?: string;
      };
      setUser(parsed);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (navRef.current && !navRef.current.contains(target)) {
        setOpenMenu(null);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    setProfileOpen(false);
    navigate("/");
  };

  const displayName =
    user?.name && user.name.trim() !== "" ? user.name : user?.email ?? "";

  return (
    <header className="relative z-50 w-full bg-[#234C6A] text-white shadow-md">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* left */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="rounded focus-visible:ring-2 focus-visible:ring-amber-400/70"
          >
            <img
              src="/logo.png"
              alt="BaiTongTicket"
              className="block w-auto max-h-12 sm:max-h-20 md:max-h-20"
            />
          </Link>

          <nav ref={navRef} className="hidden lg:flex items-center gap-2">
            {/* dropdown ทุกงานแสดง */}
            <TopDrop
              label="ทุกงานแสดง"
              openKey={openMenu}
              me="events"
              setOpen={setOpenMenu}
            />

            {/* GiftShop เป็นปุ่มธรรมดา */}
            <Link
              to="/shop"
              className="rounded-md px-3 py-1.5 text-sm text-white/90 hover:bg-white/10"
            >
              GiftShop
            </Link>

            {/* Promo เป็นปุ่มธรรมดา */}
            <Link
              to="/promo/flash"
              className="rounded-md px-3 py-1.5 text-sm text-white/90 hover:bg-white/10"
            >
              Promo
            </Link>
          </nav>
        </div>

        {/* right */}
        <div className="flex items-center gap-3">
          {/* search เดสก์ท็อป */}
          <form
            className="relative hidden md:block"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="search"
              placeholder="ค้นหา…"
              value={seaching}
              onChange={(e) => setSeaching(e.target.value)}
              className="w-72 rounded-full bg-white/10 pl-4 pr-10 py-2 text-sm placeholder-white/70 text-white outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white/40"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5 hover:bg-white/10"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          <Link to="/cart" className="rounded-full p-2 hover:bg-white/10">
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {/* โปรไฟล์ */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex rounded-full border border-white/20 items-center px-4 py-1.5 gap-2 text-sm hover:bg-white/10"
              >
                <div className="flex items-center h-6 w-6 rounded-full bg-white/20 justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="truncate max-w-[160px]">{displayName}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-lg bg-white py-2 text-slate-700 shadow-lg">
                  <p className="px-3 pb-2 text-xs text-slate-400">
                    เข้าสู่ระบบแล้ว
                  </p>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden lg:flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-sm hover:bg-white/10"
            >
              <User className="h-4 w-4" /> Register / login
            </Link>
          )}

          {/* mobile */}
          <button
            className="rounded-md p-2 hover:bg-white/10 lg:hidden"
            onClick={() => {
              setOpenMenu(null);
              setMobileOpen((v) => !v);
            }}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

            {/* MOBILE MENU */}
      <div
        className={`lg:hidden border-t border-white/10 bg-[#234C6A] shadow-lg transition-[max-height,opacity] duration-300 ease-out overflow-hidden ${
          mobileOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-4 max-h-[66vh] overflow-y-auto overscroll-contain">
          {/* ทุกงานแสดง + ประเภท */}
          <div>
            <p className="mb-1 text-sm font-semibold text-white/80">
              ทุกงานแสดง
            </p>
            {MENU_SECTIONS.events.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block pl-3 text-base text-white/90 hover:bg-white/10 rounded-lg py-2"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* GiftShop แสดงแบบหัวข้อเหมือนทุกงานแสดง แต่ยังคลิกได้ */}
          <Link
            to="/shop"
            className="text-sm font-semibold text-white/80 block"
            onClick={() => setMobileOpen(false)}
          >
            GiftShop
          </Link>

          {/* Promo แสดงแบบหัวข้อเหมือนทุกงานแสดง แต่ยังคลิกได้ */}
          <Link
            to="/promo"
            className="text-sm font-semibold text-white/80 block"
            onClick={() => setMobileOpen(false)}
          >
            Promo
          </Link>
        </div>
      </div>
    </header>
  );
}
