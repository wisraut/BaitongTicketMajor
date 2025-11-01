import React from "react";

export type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  img: string;
  badge?: string; // เช่น "Hot", "New"
};

const ProductCard: React.FC<{ item: Product }> = ({ item }) => {
  return (
    <a
      href="#"
      className="group block rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {item.badge && (
          <span className="absolute left-2 top-2 z-[1] rounded-md bg-amber-400 px-2 py-0.5 text-xs font-semibold text-slate-900">
            {item.badge}
          </span>
        )}
        <img
          src={item.img}
          alt={item.title}
          className="h-full w-full object-cover transition group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <div className="line-clamp-1 text-sm font-semibold text-slate-800">
          {item.title}
        </div>
        {item.subtitle && (
          <div className="line-clamp-1 text-xs text-slate-500">{item.subtitle}</div>
        )}
        <div className="mt-1 text-[13px] text-sky-600">฿ {item.price.toLocaleString()}</div>
      </div>
    </a>
  );
};

export default ProductCard;
