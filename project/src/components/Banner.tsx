import React from "react";

const Banner: React.FC = () => (
  <div className="w-full border-b border-slate-200/70 bg-white">
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-200">
        <img
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2060&auto=format&fit=crop"
          alt="Hero banner"
          className="h-56 w-full object-cover sm:h-80"
        />
      </div>
    </div>
  </div>
);

export default Banner;
