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

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setErrorMsg(null);

    // ตรวจรหัสผ่านตรงกันไหม
    if (password !== currentPassword) {
      setErrorMsg("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);
    try {
      // สมัครด้วย Firebase Auth ผ่าน context
      await signUp(email, password);
      // ถ้าต้องเก็บ name เพิ่ม สามารถไป set ใน Firestore / profile ภายหลังได้

      // สมัครเสร็จ → เด้งกลับไปหน้า Login
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
    "w-full rounded-full px-4 py-2 text-[15px] text-slate-700 " +
    "bg-[#f4f5f8] border border-slate-200/80 " +
    "shadow-[inset_2px_2px_4px_rgba(0,0,0,0.12),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] " +
    "outline-none placeholder:text-slate-500 " +
    "focus:ring-2 focus:ring-blue-400/70 focus:border-blue-400 transition";

  return (
    <div
        className="
          w-[380px] max-w-[92vw]
          rounded-[32px]
          p-8
          bg-[#e3e6eb]
          shadow-[inset_4px_4px_10px_rgba(0,0,0,0.13),inset_-4px_-4px_10px_rgba(255,255,255,0.85)]"
    >
      <h2 className="mb-5 text-center text-4xl font-extrabold text-[#3c455e] tracking-wide">
        Register
      </h2>

      {errorMsg && (
        <p className="mb-2 text-center text-[15px] font-medium text-red-600">
          {errorMsg}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className={fieldClass}
        />

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={fieldClass}
        />

        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={fieldClass}
        />

        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
          className={fieldClass}
        />

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="
              px-8 py-2 rounded-full
              text-sm font-semibold
              text-[#2f3d6b]
              bg-transparent
              hover:bg-[#e4ecff]
              active:bg-[#d4e0ff]
              disabled:opacity-60
              transition-all duration-150
            "
          >
            {loading ? "กำลังสมัคร..." : "Register"}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onSwitch}
          className="text-sm font-semibold text-red-700 hover:underline"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
