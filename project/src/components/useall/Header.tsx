import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { User, Menu, ChevronDown, X, LogOut } from "lucide-react";
import { TextField } from "@radix-ui/themes";
import { FaShoppingCart, FaUserAlt, FaSearch } from "react-icons/fa";

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
            <TopDrop
              label="ทุกงานแสดง"
              openKey={openMenu}
              me="events"
              setOpen={setOpenMenu}
            />

            <Link
              to="/shop"
              className="rounded-md px-3 py-1.5 text-sm text-white/90 hover:bg-white/10"
            >
              GiftShop
            </Link>

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
          {/* search desktop (Radix) */}
          <form className="hidden md:block" onSubmit={handleSearchSubmit}>
            <TextField.Root
              type="search"
              placeholder="ค้นหา..."
              value={seaching}
              onChange={(e) => setSeaching(e.target.value)}
              className="w-72 rounded-full bg-white/10 text-sm text-white placeholder:text-white/70 ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-white/40"
            >
              <TextField.Slot side="right" className="pr-3 text-white/80">
                <FaSearch className="h-4 w-4" />
              </TextField.Slot>
            </TextField.Root>
          </form>

          {/* cart – react-icons */}
          <Link
            to="/cart"
            className="rounded-full p-2 hover:bg-white/10 flex items-center justify-center"
          >
            <FaShoppingCart className="h-5 w-5" />
          </Link>

          {/* desktop login button */}
          {!user && (
            <Link
              to="/login"
              className="hidden lg:inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#234C6A] hover:bg-slate-100"
            >
              <FaUserAlt className="h-4 w-4" />
              <span>Register / login</span>
            </Link>
          )}

          {/* profile dropdown desktop */}
          {user && (
            <div className="relative hidden lg:block" ref={profileRef}>
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
                <div className="absolute right-0 mt-2 w-44 rounded-lg bg-white py-2 text-slate-700 shadow-lg">
                  <p className="px-3 pb-2 text-xs text-slate-400">
                    เข้าสู่ระบบแล้ว
                  </p>

                  {/* ปุ่มไปหน้า History */}
                  <Link
                    to="/history"
                    onClick={() => setProfileOpen(false)}
                    className="block w-full px-3 py-2 text-sm hover:bg-slate-100"
                  >
                    ประวัติการสั่งซื้อ
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* mobile menu button */}
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

          <Link
            to="/shop"
            className="text-sm font-semibold text-white/80 block"
            onClick={() => setMobileOpen(false)}
          >
            GiftShop
          </Link>

          <Link
            to="/promo"
            className="text-sm font-semibold text-white/80 block"
            onClick={() => setMobileOpen(false)}
          >
            Promo
          </Link>

          {/* login / account mobile */}
          <div className="pt-3 border-t border-white/15">
            {user ? (
              <div className="space-y-2 text-sm text-white/90">
                <p className="text-xs text-white/70">{displayName}</p>

                {/* ปุ่มสำหรับ mobile: History + Logout แยกกันด้วย gap */}
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/history"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex flex-1 min-w-[120px] justify-center rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                  >
                    ประวัติการสั่งซื้อ
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="inline-flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-[#234C6A] hover:bg-slate-100"
              >
                <FaUserAlt className="h-4 w-4" />
                <span>Register / login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
