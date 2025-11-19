import React, { useState } from "react";
import { useUserAuth } from "./UserAuthContext";
import type { FirebaseError } from "firebase/app";

type RegisterFormProps = {
  onSwitch?: () => void;
};

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitch }) => {
  const { signUp } = useUserAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setErrorMsg(null);

    if (password !== currentPassword) {
      setErrorMsg("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);

    try {
      const trimmedName = name.trim();
      await signUp(email, password, trimmedName || email);

      onSwitch?.();
    } catch (err) {
      let message = "สมัครสมาชิกไม่สำเร็จ";

      if (typeof err === "object" && err !== null && "code" in err) {
        const fbErr = err as FirebaseError;
        switch (fbErr.code) {
          case "auth/email-already-in-use":
            message = "อีเมลนี้ถูกใช้สมัครแล้ว";
            break;
          case "auth/weak-password":
            message = "รหัสผ่านต้องอย่างน้อย 6 ตัวอักษร";
            break;
          case "auth/invalid-email":
            message = "รูปแบบอีเมลไม่ถูกต้อง";
            break;
          default:
            message = fbErr.code;
        }
      }

      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // เปลี่ยนจาก rounded-full -> rounded-lg ให้เป็นสี่เหลี่ยมธรรมดา
  const fieldClass =
    "w-full rounded-lg border border-slate-300 bg-slate-100/80 px-4 py-2.5 " +
    "text-[15px] text-slate-800 placeholder:text-slate-400 " +
    "focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300";

  return (
    <div className="w-[400px] max-w-[92vw] rounded-3xl bg-slate-50 px-7 py-6 shadow-md ring-1 ring-slate-200">
      <h2 className="text-xl font-bold text-slate-900">สมัครสมาชิก</h2>
      
      {errorMsg && (
        <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700">
          {errorMsg}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            Name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className={fieldClass}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your@email.com"
            className={fieldClass}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="อย่างน้อย 6 ตัวอักษร"
            className={fieldClass}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            ConfirmPassword
          </label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="พิมพ์รหัสผ่านซ้ำอีกครั้ง"
            className={fieldClass}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-slate-900 px-7 py-2.5 text-sm font-semibold text-slate-50 hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
          >
            {loading ? "กำลังสมัคร..." : "Register"}
          </button>

          <button
            type="button"
            onClick={onSwitch}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
