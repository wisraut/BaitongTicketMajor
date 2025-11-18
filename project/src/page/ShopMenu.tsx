// import Section from "../components/useall/Section";
// import Footer from "../components/useall/Footer";
// import Header from "../components/useall/Header";
// import type { EventItem } from "../components/home/EventCard";
// import { SHOP_PRODUCTS as SHOP_EVENTS,
//         type ShopProduct as ShopEvent, 
//       } from "../data/shopProducts";

// function toEventItem(event: ShopEvent): EventItem {
//   return {
//     id: event.id,
//     image: event.banner,
//     title: event.title,
//     subtitle: event.subtitle,
//     date: event.dateRange,
//     venue: event.venue,
//     time: event.Time ?? "",
//   };
// }

// export default function SportMenuPage() {
//   const shopItem = SHOP_EVENTS.map(toEventItem);
//   return (
//     <div className="min-h-screen bg-white text-slate-900">
//       <Header />
//       <main>
//         <Section title="Sport Events" items={shopItem} />
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <hr className="my-6 border-slate-200" />
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }
