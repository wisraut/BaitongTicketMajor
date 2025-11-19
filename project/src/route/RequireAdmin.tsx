// src/route/RequireAdmin.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useUserAuth } from "../context/UserAuthContext";
import { db } from "../components/base/firebase";

type RequireAdminProps = {
  children: JSX.Element;
};

// ถ้าต้องการ hard-code admin เพิ่ม/ลดตรงนี้ได้เลย
const HARD_CODED_ADMINS = ["folkadmin@bttmj.com"];

export default function RequireAdmin({ children }: RequireAdminProps) {
  const { user, loading } = useUserAuth();
  const [roleChecked, setRoleChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      // ยังโหลด auth ไม่เสร็จ อย่าเพิ่งเช็ก
      if (loading) {
        console.log("[RequireAdmin] still loading auth");
        return;
      }

      // ยังไม่ได้ล็อกอิน
      if (!user) {
        console.log("[RequireAdmin] no user");
        setIsAdmin(false);
        setRoleChecked(true);
        return;
      }

      console.log(
        "[RequireAdmin] checking role for uid:",
        user.uid,
        "email:",
        user.email
      );

      // เช็กจาก email แบบ hard-code ก่อน เผื่อ Firestore มีปัญหา
      const email = user.email ?? "";
      if (HARD_CODED_ADMINS.includes(email)) {
        console.log("[RequireAdmin] matched HARD_CODED_ADMINS");
        setIsAdmin(true);
        setRoleChecked(true);
        return;
      }

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          console.log(
            "[RequireAdmin] Firestore doc not found for uid:",
            user.uid
          );
          setIsAdmin(false);
        } else {
          const data = snap.data() as { role?: string } | undefined;
          console.log("[RequireAdmin] Firestore data:", data);

          const flag = data?.role === "admin";
          setIsAdmin(flag);
        }
      } catch (err) {
        console.log("[RequireAdmin] Firestore error:", err);
        setIsAdmin(false);
      } finally {
        setRoleChecked(true);
      }
    }

    checkAdmin();
  }, [user, loading]);

  // รอทั้ง auth + role
  if (loading || !roleChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm text-slate-600">กำลังตรวจสอบสิทธิ์...</p>
      </div>
    );
  }

  // ยังไม่ได้ล็อกอิน
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm text-center">
          <p className="text-sm text-slate-700 mb-3">
            หน้านี้สำหรับผู้ดูแลระบบเท่านั้น กรุณาเข้าสู่ระบบก่อน
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-[#234C6A] px-4 py-2 text-sm font-semibold text-white"
          >
            ไปหน้าเข้าสู่ระบบ
          </a>
        </div>
      </div>
    );
  }

  // ล็อกอินแล้วแต่ไม่ใช่ admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // ผ่านทุกอย่าง เป็น admin แล้ว
  return children;
}
