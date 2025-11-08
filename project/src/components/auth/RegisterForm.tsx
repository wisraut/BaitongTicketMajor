import React, { useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // ตรวจรหัสผ่านตรงกันไหม
    if (password !== currentPassword) {
      setErrorMsg("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);

      // สมัครสำเร็จ → เด้งไปหน้า login เลย
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

  const fieldClass =
    "rounded-full bg-[#dcdcdc] px-4 py-2 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.25),inset_-2px_-2px_4px_rgba(255,255,255,0.6)] transition hover:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]";
  const inputClass =
    "w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500";

  return (
    <div className="w-[360px] rounded-[28px] bg-[#dcdcdc] px-6 py-7 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]">
      <h2 className="mb-6 text-center text-4xl font-bold tracking-wide text-[#6a6a6a]">
        Register
      </h2>

      {errorMsg && (
        <p className="mb-3 text-center text-[15px] font-medium text-red-600 drop-shadow-sm">
          {errorMsg}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={fieldClass}>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className={inputClass}
          />
        </div>
        <div className={fieldClass}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={inputClass}
          />
        </div>
        <div className={fieldClass}>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={inputClass}
          />
        </div>
        <div className={fieldClass}>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mx-auto mt-3 block rounded-full bg-[#dcdcdc] px-8 py-2 text-sm font-semibold text-slate-800 shadow-[3px_3px_6px_rgba(0,0,0,0.25),-3px_-3px_6px_rgba(255,255,255,0.6)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "กำลังสมัคร..." : "Register"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onSwitch}
          className="text-sm font-semibold text-red-700 hover:underline transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
