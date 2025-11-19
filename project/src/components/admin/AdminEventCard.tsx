// src/components/admin/AdminEventCard.tsx

import React from "react";
import type { AdminEvent } from "../../data/adminEvent";

type AdminEventCardProps = {
  event: AdminEvent;
  onDelete?: () => void;
};

const AdminEventCard: React.FC<AdminEventCardProps> = ({ event, onDelete }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col overflow-hidden">
      {event.bannerPath && (
        <div className="w-full h-40 overflow-hidden">
          <img
            src={event.bannerPath}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4 flex flex-col gap-2">
        <div>
          <h3 className="font-semibold text-lg leading-snug">{event.title}</h3>
          {event.subtitle && (
            <p className="text-sm text-gray-600">{event.subtitle}</p>
          )}
        </div>

        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-medium">Event ID: </span>
            {event.eventId}
          </p>
          <p>
            <span className="font-medium">ช่วงงาน: </span>
            {event.dateRange}
          </p>
          {event.time && (
            <p>
              <span className="font-medium">เวลา: </span>
              {event.time}
            </p>
          )}
          <p>
            <span className="font-medium">สถานที่: </span>
            {event.venue}
          </p>
          <p>
            <span className="font-medium">ประเภท: </span>
            {event.category}
          </p>
        </div>

        <p className="text-sm text-gray-700 line-clamp-3">
          {event.description}
        </p>

        <div className="mt-3 flex justify-end gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700"
            >
              ลบอีเวนต์
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEventCard;
