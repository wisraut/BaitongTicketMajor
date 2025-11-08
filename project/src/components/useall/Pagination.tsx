// src/components/Local/Pagination.tsx (หรือที่โฟลเดอร์เดิมของคุณ)
import React from "react";
import { Link, useSearchParams } from "react-router-dom";

type Props = {
  total?: number; // จำนวนหน้าทั้งหมด
};

const Pagination: React.FC<Props> = ({ total = 3 }) => {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? "1");

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  // ฟังก์ชันช่วยสร้างลิงก์แบบเก็บ query ตัวอื่นไว้
  const makeLink = (page: number) => {
    const sp = new URLSearchParams(searchParams);
    sp.set("page", String(page));
    return `?${sp.toString()}`;
  };

  const nextPage = Math.min(currentPage + 1, total);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center gap-2">
        {pages.map((n) => (
          <Link
            key={n}
            to={makeLink(n)}
            className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm transition
              ${
                n === currentPage
                  ? "border-amber-400 bg-amber-400/90 font-semibold text-slate-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
          >
            {n}
          </Link>
        ))}

        {/* next */}
        <Link
          to={makeLink(nextPage)}
          className="flex h-9 items-center rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 hover:bg-slate-50"
        >
          &gt;
        </Link>
      </div>
    </div>
  );
};

export default Pagination;
