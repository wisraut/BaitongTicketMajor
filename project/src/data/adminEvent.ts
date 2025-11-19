// src/data/adminEvent.ts

export type EventCategory = "concert" | "sport" | "performance";

export type AdminEvent = {
  // document id ใน Firestore
  id: string;

  // ใช้เป็น slug / Event ID ของงาน
  eventId: string;

  title: string;
  subtitle?: string | null;

  dateRange: string;
  time: string;
  venue: string;

  description: string;

  bannerPath: string;
  stageImagePath: string;

  category: EventCategory;
  createdAt?: any;
};
