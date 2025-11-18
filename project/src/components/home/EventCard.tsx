import React from "react";
import { Link } from "react-router-dom";

export type EventItem = {
  id: string | number;
  image: string;
  title: string;
  subtitle?: string;
  date?: string;
  time?: string;
  venue?: string;
  badge?: string;
  linkTo?: string;
};

const EventCard: React.FC<{ item: EventItem }> = ({ item }) => {
  const href = item.linkTo ?? `/events/${item.id}`;

  return (
    <Link
      to={href}
      className="group rounded-2xl border border-white transition hover:-translate-y-0.5 hover:shadow-md block"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-2xl">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full group-hover:scale-105 duration-300 transition  object-cover"
        />
        {item.badge && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-400/95 px-2 py-0.5 text-xs font-semibold text-slate-900">
            {item.badge}
          </span>
        )}
      </div>
      <div className="space-y-1.5 p-3">
        <p className="line-clamp-1 text-[13px] font-medium text-slate-900">
          {item.title}
        </p>
        {item.subtitle && (
          <p className="line-clamp-1 text-[12px] text-slate-600">
            {item.subtitle}
          </p>
        )}
        {(item.date || item.time) && (
          <p className="text-[12px] text-slate-600">
            {item.date ?? ""} {item.date && item.time ? "•" : ""}{" "}
            {item.time ? `${item.time} ` : ""}
          </p>
        )}
        {item.venue && (
          <p className="text-[12px] text-slate-500">{item.venue}</p>
        )}
      </div>
    </Link>
  );
};

export default EventCard;
