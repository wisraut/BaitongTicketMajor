import React from "react";
import { Facebook, Instagram, Twitter, Youtube, MessageCircle, Phone, Mail } from "lucide-react";

const Footer: React.FC = () => {
  const linkClass = "text-sm text-slate-600 hover:text-slate-900";
  return (
    <footer className="border-t bg-slate-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h4 className="mb-3 text-lg font-semibold text-slate-900">FOLLOW US</h4>
          <div className="flex flex-wrap gap-2">
            {[Facebook, Instagram, Twitter, Youtube, MessageCircle].map((Icon, i) => (
              <a key={i} href="#" className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-lg font-semibold text-slate-900">FAQ</h4>
          <ul className="space-y-1.5">
            {["How to Buy", "Payment Methods", "Delivery Options", "Refund Policy"].map((t) => (
              <li key={t}>
                <a href="#" className={linkClass}>{t}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-lg font-semibold text-slate-900">ABOUT US</h4>
          <p className="max-w-prose text-sm leading-6 text-slate-600">
            Online ticketing for concerts, sports, and special events. Secure checkout, multiple payment channels, and Thai support.
          </p>
          <div className="mt-4 space-y-1 text-sm text-slate-600">
            <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +66 2 123 4567</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@baitongticket.com</div>
          </div>
        </div>
      </div>
      <div className="border-t bg-white py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} BaiTongTicket — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
