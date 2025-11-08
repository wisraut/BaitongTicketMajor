import React, { useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";

type LoginFormProps = {
  onSuccess?: () => void;
  onSwitch?: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitch }) => {
  const { logIn } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const cred = await logIn(email, password);

      // ให้ header เดิมยังอ่านได้
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          email: cred.user.email,
          uid: cred.user.uid,
        })
      );

      onSuccess?.();
    } catch {
      setErrorMsg("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[360px] rounded-[28px] bg-[#dcdcdc] px-6 py-7 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]">
      <h2 className="mb-6 text-center text-4xl font-bold tracking-wide text-[#6a6a6a]">
        Login
      </h2>

      {errorMsg && (
        <p className="mb-3 text-center text-[15px] font-medium text-red-600 drop-shadow-sm">
          {errorMsg}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="rounded-full bg-[#dcdcdc] px-4 py-2 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.25),inset_-2px_-2px_4px_rgba(255,255,255,0.6)] transition hover:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500"
          />
        </div>

        {/* Password */}
        <div className="rounded-full bg-[#dcdcdc] px-4 py-2 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.25),inset_-2px_-2px_4px_rgba(255,255,255,0.6)] transition hover:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mx-auto mt-3 block rounded-full bg-[#dcdcdc] px-8 py-2 text-sm font-semibold text-slate-800 shadow-[3px_3px_6px_rgba(0,0,0,0.25),-3px_-3px_6px_rgba(255,255,255,0.6)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onSwitch}
          className="text-sm font-semibold text-red-700 hover:underline transition-colors"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
