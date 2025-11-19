// src/page/Admin.tsx
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../components/auth/firebase";
import Header from "../components/base/Header";
import Footer from "../components/base/Footer";

type AdminKind = "concert" | "sport" | "performance" | "product";

type EventPrice = {
  name: string;
  price: number;
};

type EventForm = {
  id: string;
  title: string;
  subtitle: string;
  dateRange: string;
  time: string;
  venue: string;
  description: string;
  bannerUrl: string;
  stageImageUrl: string;
  prices: EventPrice[];
};

type ProductVariant = {
  id: string;
  label: string;
  price: number;
};

type ProductForm = {
  id: string;
  name: string;
  subtitle: string;
  category: "tshirt" | "Assessories";
  description: string;
  bannerUrl: string;
  images: string[];
  details: string[];
  variants: ProductVariant[];
};

export default function AdminPage() {
  const [kind, setKind] = useState<AdminKind>("concert");

  const [eventForm, setEventForm] = useState<EventForm>({
    id: "",
    title: "",
    subtitle: "",
    dateRange: "",
    time: "",
    venue: "",
    description: "",
    bannerUrl: "",
    stageImageUrl: "",
    prices: [{ name: "", price: 0 }],
  });

  const [productForm, setProductForm] = useState<ProductForm>({
    id: "",
    name: "",
    subtitle: "",
    category: "tshirt",
    description: "",
    bannerUrl: "",
    images: [],
    details: [""],
    variants: [{ id: "small", label: "Small", price: 0 }],
  });

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [stageFile, setStageFile] = useState<File | null>(null);
  const [extraImages, setExtraImages] = useState<FileList | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isEvent =
    kind === "concert" || kind === "sport" || kind === "performance";

  const handleEventChange = (
    field: keyof EventForm,
    value: string | EventPrice[]
  ) => {
    setEventForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProductChange = (
    field: keyof ProductForm,
    value: string | ProductVariant[] | string[] | ("tshirt" | "Assessories")
  ) => {
    setProductForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ================== ใช้อันนี้แทน handleSubmit เดิม ==================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (isEvent) {
        if (!eventForm.id || !eventForm.title) {
          setMessage("กรุณากรอก id และ title ของงานแสดง");
          return;
        }

        let bannerUrl = eventForm.bannerUrl;
        let stageUrl = eventForm.stageImageUrl;

        if (bannerFile) {
          const bannerRef = ref(
            storage,
            `events/${eventForm.id}/banner_${bannerFile.name}`
          );
          console.log("[Admin] upload banner to", bannerRef.fullPath);
          await uploadBytes(bannerRef, bannerFile);
          bannerUrl = await getDownloadURL(bannerRef);
        }

        if (stageFile) {
          const stageRef = ref(
            storage,
            `events/${eventForm.id}/stage_${stageFile.name}`
          );
          console.log("[Admin] upload stage image to", stageRef.fullPath);
          await uploadBytes(stageRef, stageFile);
          stageUrl = await getDownloadURL(stageRef);
        }

        await addDoc(collection(db, "events"), {
          type: kind,
          id: eventForm.id,
          title: eventForm.title,
          subtitle: eventForm.subtitle,
          banner: bannerUrl,
          stageImage: stageUrl,
          dateRange: eventForm.dateRange,
          Time: eventForm.time,
          venue: eventForm.venue,
          description: eventForm.description,
          prices: eventForm.prices.filter((p) => p.name && p.price > 0),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        setMessage("บันทึกงานแสดงเรียบร้อย");
      } else {
        if (!productForm.id || !productForm.name) {
          setMessage("กรุณากรอก id และชื่อสินค้า");
          return;
        }

        let bannerUrl = productForm.bannerUrl;
        const imageUrls: string[] = [];

        if (bannerFile) {
          const bannerRef = ref(
            storage,
            `products/${productForm.id}/banner_${bannerFile.name}`
          );
          console.log("[Admin] upload product banner to", bannerRef.fullPath);
          await uploadBytes(bannerRef, bannerFile);
          bannerUrl = await getDownloadURL(bannerRef);
        }

        if (extraImages && extraImages.length > 0) {
          for (let i = 0; i < extraImages.length; i += 1) {
            const file = extraImages[i];
            const imgRef = ref(
              storage,
              `products/${productForm.id}/extra_${i}_${file.name}`
            );
            console.log("[Admin] upload extra image to", imgRef.fullPath);
            await uploadBytes(imgRef, file);
            const url = await getDownloadURL(imgRef);
            imageUrls.push(url);
          }
        }

        await addDoc(collection(db, "products"), {
          id: productForm.id,
          name: productForm.name,
          subtitle: productForm.subtitle,
          category: productForm.category,
          description: productForm.description,
          banner: bannerUrl,
          images: imageUrls.length > 0 ? imageUrls : [bannerUrl],
          details: productForm.details.filter((d) => d.trim() !== ""),
          variants: productForm.variants.filter((v) => v.label && v.price > 0),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        setMessage("บันทึกสินค้าเรียบร้อย");
      }
    } catch (err) {
      console.error("[Admin] submit error", err);
      const msg = err instanceof Error ? err.message : String(err);
      setMessage("เกิดปัญหาในการบันทึกข้อมูล: " + msg);
    } finally {
      setSaving(false);
    }
  };
  // =====================================================================

  const resetForms = () => {
    setEventForm({
      id: "",
      title: "",
      subtitle: "",
      dateRange: "",
      time: "",
      venue: "",
      description: "",
      bannerUrl: "",
      stageImageUrl: "",
      prices: [{ name: "", price: 0 }],
    });
    setProductForm({
      id: "",
      name: "",
      subtitle: "",
      category: "tshirt",
      description: "",
      bannerUrl: "",
      images: [],
      details: [""],
      variants: [{ id: "small", label: "Small", price: 0 }],
    });
    setBannerFile(null);
    setStageFile(null);
    setExtraImages(null);
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-slate-600">
              สร้าง Event และสินค้าใหม่เพื่อแสดงบนหน้าเว็บ
            </p>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <label className="text-sm font-medium">ประเภทที่ต้องการสร้าง</label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as AdminKind)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="concert">Event: Concert</option>
              <option value="sport">Event: Sport</option>
              <option value="performance">Event: Performance Art</option>
              <option value="product">Shop Product</option>
            </select>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm">
            {message}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            {isEvent ? (
              <>
                <h2 className="text-lg font-semibold">ข้อมูลงานแสดง</h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Event ID
                    </label>
                    <input
                      value={eventForm.id}
                      onChange={(e) => handleEventChange("id", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      ชื่องาน
                    </label>
                    <input
                      value={eventForm.title}
                      onChange={(e) =>
                        handleEventChange("title", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      คำโปรยสั้น
                    </label>
                    <input
                      value={eventForm.subtitle}
                      onChange={(e) =>
                        handleEventChange("subtitle", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      ช่วงวันจัดงาน
                    </label>
                    <input
                      value={eventForm.dateRange}
                      onChange={(e) =>
                        handleEventChange("dateRange", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      เวลา
                    </label>
                    <input
                      value={eventForm.time}
                      onChange={(e) =>
                        handleEventChange("time", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      สถานที่จัดงาน
                    </label>
                    <input
                      value={eventForm.venue}
                      onChange={(e) =>
                        handleEventChange("venue", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    รายละเอียด
                  </label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) =>
                      handleEventChange("description", e.target.value)
                    }
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Banner
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setBannerFile(e.target.files ? e.target.files[0] : null)
                      }
                      className="w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      ผังที่นั่ง (Stage Image)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setStageFile(e.target.files ? e.target.files[0] : null)
                      }
                      className="w-full text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    ราคาบัตรแต่ละโซน
                  </label>
                  <div className="space-y-2">
                    {eventForm.prices.map((p, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          placeholder="ชื่อโซน"
                          value={p.name}
                          onChange={(e) => {
                            const list = [...eventForm.prices];
                            list[index] = {
                              ...list[index],
                              name: e.target.value,
                            };
                            handleEventChange("prices", list);
                          }}
                          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                        <input
                          type="number"
                          placeholder="ราคา"
                          value={p.price}
                          onChange={(e) => {
                            const list = [...eventForm.prices];
                            list[index] = {
                              ...list[index],
                              price: Number(e.target.value) || 0,
                            };
                            handleEventChange("prices", list);
                          }}
                          className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const list = [...eventForm.prices];
                            list.splice(index, 1);
                            handleEventChange("prices", list);
                          }}
                          className="text-xs text-red-600"
                        >
                          ลบ
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        handleEventChange("prices", [
                          ...eventForm.prices,
                          { name: "", price: 0 },
                        ])
                      }
                      className="text-xs text-[#234C6A]"
                    >
                      เพิ่มโซน
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold">ข้อมูลสินค้า Shop</h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Product ID
                    </label>
                    <input
                      value={productForm.id}
                      onChange={(e) =>
                        handleProductChange("id", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      ชื่อสินค้า
                    </label>
                    <input
                      value={productForm.name}
                      onChange={(e) =>
                        handleProductChange("name", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      คำโปรยสั้น
                    </label>
                    <input
                      value={productForm.subtitle}
                      onChange={(e) =>
                        handleProductChange("subtitle", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      หมวดหมู่
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) =>
                        handleProductChange(
                          "category",
                          e.target.value as "tshirt" | "Assessories"
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="tshirt">T-Shirt</option>
                      <option value="Assessories">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Banner
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setBannerFile(e.target.files ? e.target.files[0] : null)
                      }
                      className="w-full text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    รูปภาพเพิ่มเติม
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setExtraImages(e.target.files)}
                    className="w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    รายละเอียดสินค้า
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) =>
                      handleProductChange("description", e.target.value)
                    }
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    จุดเด่น / รายละเอียดเพิ่มเติม
                  </label>
                  <div className="space-y-2">
                    {productForm.details.map((d, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          value={d}
                          onChange={(e) => {
                            const list = [...productForm.details];
                            list[index] = e.target.value;
                            handleProductChange("details", list);
                          }}
                          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const list = [...productForm.details];
                            list.splice(index, 1);
                            handleProductChange("details", list);
                          }}
                          className="text-xs text-red-600"
                        >
                          ลบ
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        handleProductChange("details", [
                          ...productForm.details,
                          "",
                        ])
                      }
                      className="text-xs text-[#234C6A]"
                    >
                      เพิ่มรายการ
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    ตัวเลือกสินค้า (เช่น Size)
                  </label>
                  <div className="space-y-2">
                    {productForm.variants.map((v, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          placeholder="รหัสเช่น small"
                          value={v.id}
                          onChange={(e) => {
                            const list = [...productForm.variants];
                            list[index] = {
                              ...list[index],
                              id: e.target.value,
                            };
                            handleProductChange("variants", list);
                          }}
                          className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                        <input
                          placeholder="ชื่อเช่น Small"
                          value={v.label}
                          onChange={(e) => {
                            const list = [...productForm.variants];
                            list[index] = {
                              ...list[index],
                              label: e.target.value,
                            };
                            handleProductChange("variants", list);
                          }}
                          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                        <input
                          type="number"
                          placeholder="ราคา"
                          value={v.price}
                          onChange={(e) => {
                            const list = [...productForm.variants];
                            list[index] = {
                              ...list[index],
                              price: Number(e.target.value) || 0,
                            };
                            handleProductChange("variants", list);
                          }}
                          className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const list = [...productForm.variants];
                            list.splice(index, 1);
                            handleProductChange("variants", list);
                          }}
                          className="text-xs text-red-600"
                        >
                          ลบ
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        handleProductChange("variants", [
                          ...productForm.variants,
                          { id: "", label: "", price: 0 },
                        ])
                      }
                      className="text-xs text-[#234C6A]"
                    >
                      เพิ่มตัวเลือก
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#234C6A] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-400"
              >
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
              <button
                type="button"
                onClick={resetForms}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700"
              >
                ล้างฟอร์ม
              </button>
            </div>
          </form>

          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-2 text-sm font-semibold text-slate-900">
                Preview การ์ด
              </h2>
              {isEvent ? (
                <div className="rounded-xl border border-slate-200 p-3 text-sm">
                  <p className="font-semibold">
                    {eventForm.title || "ชื่องานแสดง"}
                  </p>
                  <p className="text-xs text-slate-600">
                    {eventForm.subtitle || "คำโปรยสั้น"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {eventForm.dateRange || "วันเวลา"} {eventForm.time && " | "}
                    {eventForm.time}
                  </p>
                  <p className="text-xs text-slate-500">
                    {eventForm.venue || "สถานที่จัดงาน"}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 p-3 text-sm">
                  <p className="font-semibold">
                    {productForm.name || "ชื่อสินค้า"}
                  </p>
                  <p className="text-xs text-slate-600">
                    {productForm.subtitle || "คำโปรยสั้น"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {productForm.category === "tshirt"
                      ? "หมวดหมู่: T-Shirt"
                      : "หมวดหมู่: Accessories"}
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 text-xs text-slate-600">
              <p className="font-semibold mb-1">หมายเหตุการใช้งาน</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  Event จะถูกบันทึกใน collection
                  <span className="font-mono"> events</span>
                </li>
                <li>
                  สินค้า Shop จะถูกบันทึกใน collection
                  <span className="font-mono"> products</span>
                </li>
                <li>รูปภาพทั้งหมดเก็บใน Firebase Storage ตาม path ของ id</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
