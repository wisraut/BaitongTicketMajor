import { useNavigate, useParams } from "react-router-dom";

import { EVENTS as CONCERT_EVENTS } from "../data/eventconcert";
import { EVENTS as BOXING_EVENTS } from "../data/eventboxing";
import { EVENTS as GIFTSHOP_EVENTS } from "../data/eventgiftshop";
import { EVENTS as PERFORMANCE_EVENTS } from "../data/eventperformance";

import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";

const ALL_EVENTS = [
  ...CONCERT_EVENTS,
  ...BOXING_EVENTS,
  ...GIFTSHOP_EVENTS,
  ...PERFORMANCE_EVENTS,
];

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const event = ALL_EVENTS.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-slate-600">ไม่พบงานแสดง</p>
      </div>
    );
  }

  const handleGoPayment = () => {
    localStorage.setItem("currentEventId", event.id);
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="bg-black">
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-10">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/3">
              {event.banner && (
                <img
                  src={event.banner}
                  alt={event.title}
                  className="w-full rounded-lg object-cover"
                />
              )}
            </div>
            <div className="flex-1 space-y-3 text-center md:text-left text-white">
              <h1 className="text-2xl font-bold">{event.title}</h1>
              {event.subtitle && (
                <p className="text-sm text-slate-200">{event.subtitle}</p>
              )}
              {event.dateRange && (
                <p className="text-sm text-slate-200">
                  วันจัดงาน {event.dateRange}
                </p>
              )}
              {event.venue && (
                <p className="text-sm text-slate-200">
                  สถานที่จัดงาน {event.venue}
                </p>
              )}
              {event.Time && (
                <p className="text-sm text-slate-200">เวลา {event.Time}</p>
              )}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleGoPayment}
                  className="inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                  จองบัตร
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {event.description && (
          <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-800">
            {event.description}
          </div>
        )}

        {event.stageImage && (
          <div className="flex justify-center pb-8">
            <img
              src={event.stageImage}
              alt="ผังที่นั่ง"
              className="max-w-full rounded-lg object-contain"
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
