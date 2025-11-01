import React from "react";

const Pagination: React.FC = () => (
  <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3].map((n) => (
        <a
          key={n}
          href="#"
          className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm ${
            n === 1
              ? "border-amber-400 bg-amber-400/90 font-semibold text-slate-900"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          {n}
        </a>
      ))}
      <a href="#" className="flex h-9 items-center rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 hover:bg-slate-50">
        &gt;
      </a>
    </div>
  </div>
);

export default Pagination;
