import React from "react";
import ProductCard, { Product } from "./ProductCard";

const SectionGrid: React.FC<{ title: string; items: Product[] }> = ({ title, items }) => {
  return (
    <section className="mx-auto w-full max-w-[1160px] px-4">
      <div className="border-b border-slate-300 pb-3 pt-6 text-[15px] font-semibold text-slate-800">
        {title}
      </div>

      <div className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((p) => (
          <ProductCard key={p.id} item={p} />
        ))}
      </div>
    </section>
  );
};

export default SectionGrid;
