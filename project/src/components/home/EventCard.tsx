import React from "react";

export type EventItem = {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
  date: string;
  time: string;
  venue: string;
  badge?: string;
};

const EventCard: React.FC<{ item: EventItem }> = ({ item }) => (
  <a href="#" className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-2xl">
      <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
      {item.badge && (
        <span className="absolute left-2 top-2 rounded-full bg-amber-400/95 px-2 py-0.5 text-xs font-semibold text-slate-900">
          {item.badge}
        </span>
      )}
    </div>
    <div className="space-y-1.5 p-3">
      <p className="line-clamp-1 text-[13px] font-medium text-slate-900">{item.title}</p>
      {item.subtitle && <p className="line-clamp-1 text-[12px] text-slate-600">{item.subtitle}</p>}
      <p className="text-[12px] text-slate-600">{item.date} • {item.time} น.</p>
      <p className="text-[12px] text-slate-500">{item.venue}</p>
    </div>
  </a>
);

export default EventCard;
