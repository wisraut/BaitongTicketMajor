import { useParams, Link } from "react-router-dom";
import { EVENTS } from "../data/eventconcert";
import Header from "../components/Local/Header";
import Footer from "../components/Local/Footer";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const event = EVENTS.find((e) => e.id === id);

  if (!event) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 max-w-5xl mx-auto p-6">
            <p>ไม่พบอีเวนต์นี้</p>
            <Link to="/events" className="text-blue-500 underline">
              กลับหน้ารวม
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen flex flex-col bg-white">
        {/* ส่วนบนพื้นดำ */}
        <div className="w-full bg-black text-white">
          <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
            {/* รูปโปสเตอร์ */}
            <div className="w-36 md:w-48 flex-shrink-0">
              <img
                src={event.banner}
                alt={event.title}
                className="w-full h-auto rounded"
              />
            </div>

            {/* ข้อมูลขวา */}
            <div className="flex-1 space-y-2">
              <h1 className="text-xl md:text-2xl font-semibold leading-snug">
                {event.title}
              </h1>
              {event.subtitle ? (
                <p className="text-sm text-gray-200">{event.subtitle}</p>
              ) : null}

              <div className="text-sm md:text-base space-y-1 mt-2">
                <p>{event.dateRange}</p>
                <p className="font-semibold underline underline-offset-2">
                  สถานที่: {event.venue}
                </p>
                <p>เวลา: {event.Time}</p>
              </div>
              {/* ปุ่มจอง */}
              <button className="mt-4 bg-red-500 hover:bg-red-600 transition text-white px-6 py-2 rounded font-semibold text-sm">
                จองบัตร
              </button>
            </div>
          </div>
        </div>

        {/* description */}
        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-4 md:px-0 py-8 space-y-8">
            {/* รายละเอียดข้อความ */}
            <div className="space-y-4 text-sm leading-relaxed text-gray-800">
              <p>{event.description}</p>

              {event.prices?.length ? (
                <div>
                  <p className="font-semibold mb-2">ประเภทบัตร / ราคา</p>
                  <ul className="list-disc list-inside space-y-1">
                    {event.prices.map((tier) => (
                      <li key={tier.name}>
                        {tier.name} — {tier.price.toLocaleString()} บาท
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {/* รูปผังเวที */}
            <div className="flex justify-center">
              <img
                src={event.stageImage}
                alt="stage plan"
                className="w-full max-w-md rounded border"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
