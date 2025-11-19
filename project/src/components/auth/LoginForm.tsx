import React, { useState } from "react";
import { useUserAuth } from "./UserAuthContext";
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

      const displayName =
        result.user.displayName && result.user.displayName.trim() !== ""
          ? result.user.displayName
          : email;

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          name: displayName,
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

  // ให้เหมือน regis: ใช้สี่เหลี่ยมมุมโค้งนิดหน่อย
  const fieldClass =
    "w-full rounded-lg border border-slate-300 bg-slate-100/80 px-4 py-2.5 " +
    "text-[15px] text-slate-800 placeholder:text-slate-400 " +
    "focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300";

  const actionBtn =
    "inline-flex items-center justify-center rounded-full px-8 py-2.5 text-sm font-semibold " +
    "bg-slate-900 text-slate-50 hover:bg-slate-800 " +
    "disabled:bg-slate-400 disabled:cursor-not-allowed transition";

  return (
    <div className="w-[400px] max-w-[92vw] rounded-3xl bg-slate-50 px-7 py-6 shadow-md ring-1 ring-slate-200">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">เข้าสู่ระบบ</h2>
          {/* <p className="text-xs text-slate-500">
            ใช้อีเมลที่คุณสมัคร BaiTongTicket ไว้
          </p> */}
        </div>

        {errorMsg && (
          <Text
            as="p"
            className="rounded-xl bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700"
          >
            {errorMsg}
          </Text>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-600">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
            placeholder="Your@email.com"
            className={fieldClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-600">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
            placeholder="Password"
            className={fieldClass}
          />
        </div>

        <div className="pt-1 flex items-center justify-between">
          <button type="submit" disabled={submitting} className={actionBtn}>
            {submitting ? "กำลังเข้าสู่ระบบ..." : "Login"}
          </button>
          <button
            type="button"
            onClick={props.onSwitch}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline"
          >
            สมัครสมาชิก
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
