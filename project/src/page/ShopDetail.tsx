import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import Header from "../components/useall/Header";
import Footer from "../components/useall/Footer";
import EventCard, { type EventItem } from "../components/home/EventCard";
import { SHOP_PRODUCTS } from "../data/shopProducts";

function toShopItem(product: any): EventItem {
  return {
    id: product.id,
    image: product.banner,
    title: product.name,
    subtitle: product.subtitle,
    date: "",
    venue: "",
    time: "",
    linkTo: `/shop/${product.id}`,
  };
}

function mergeById(base: EventItem[], extra: EventItem[]): EventItem[] {
  const map = new Map<EventItem["id"], EventItem>();
  base.forEach((item) => map.set(item.id, item));
  extra.forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
}

export default function ShopMenuPage() {
  const baseItems = SHOP_PRODUCTS.map(toShopItem);
  const [extraItems, setExtraItems] = useState<EventItem[]>([]);
  const items = mergeById(baseItems, extraItems);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, "products"));
        const fromFs = snap.docs.map((doc) => toShopItem(doc.data()));
        setExtraItems(fromFs);
      } catch (err) {
        console.error("[ShopMenu] load error", err);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="mb-4 text-2xl font-bold">GiftShop</h1>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <EventCard key={item.id} item={item} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
