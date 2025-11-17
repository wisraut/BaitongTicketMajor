import React, { useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import { Text } from "@radix-ui/themes";

type LoginFormProps = {
  onSuccess?: () => void;
  onSwitch?: () => void;
};

const LoginForm: React.FC<LoginFormProps> = (props) => {
  const { logIn } = useUserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const result = await logIn(email, password);

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          email: result.user.email,
          uid: result.user.uid,
        })
      );

      props.onSuccess?.();
    } catch {
      setErrorMsg("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "w-full rounded-full px-4 py-2 text-[15px] text-slate-700 " +
    "bg-[#f4f5f8] border border-slate-200/80 " +
    "shadow-[inset_2px_2px_4px_rgba(0,0,0,0.12),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] " +
    "outline-none placeholder:text-slate-500 " +
    "focus:ring-2 focus:ring-blue-400/70 focus:border-blue-400 transition";

  // ⭐ ปุ่มที่ Register ใช้อยู่
  const actionBtn =
    "px-8 py-2 rounded-full text-sm font-semibold text-[#2f3d6b] " +
    "bg-transparent hover:bg-[#e4ecff] active:bg-[#d4e0ff] " +
    "transition-all duration-150 disabled:opacity-60";

  return (
      <div
        className="
          w-[380px] max-w-[92vw]
          rounded-[32px]
          p-8
          bg-[#e3e6eb]
          shadow-[inset_4px_4px_10px_rgba(0,0,0,0.13),inset_-4px_-4px_10px_rgba(255,255,255,0.85)]"
      >
      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="text-center text-4xl font-extrabold text-[#3c455e] tracking-wide">
          Login
        </h2>

        {errorMsg && (
          <Text as="p" className="text-center text-[15px] font-medium text-red-600">
            {errorMsg}
          </Text>
        )}

        <input
          type="email"
          required
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
          placeholder="Email"
          className={fieldClass}
        />

        <input
          type="password"
          required
          value={password}
          onChange={(evt) => setPassword(evt.target.value)}
          placeholder="Password"
          className={fieldClass}
        />

        <div className="pt-1 flex justify-center">
          <button
            type="submit"
            disabled={submitting}
            className={actionBtn}
          >
            {submitting ? "กำลังเข้าสู่ระบบ..." : "Login"}
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={props.onSwitch}
            className="text-sm font-semibold text-red-700 hover:underline"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
