import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Local/Header";
import Footer from "../components/Local/Footer";

// บอกเลยว่าผู้ใช้หน้าตาเป็นแบบนี้
type StoredUser = {
  email: string;
  phone?: string;
  password: string;
};

const Login: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ดึง users จาก localStorage แบบมี type
  const getUsers = (): StoredUser[] => {
    const raw = localStorage.getItem("users");
    if (!raw) return [];
    try {
      return JSON.parse(raw) as StoredUser[];
    } catch {
      return [];
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();

    // เช็กได้ทั้ง email และ phone
    const found = users.find(
      (u) =>
        (u.email === email || u.phone === email) &&
        u.password === password
    );

    if (found) {
      localStorage.setItem("loggedInUser", JSON.stringify(found));
      setMessage("✅ Login สำเร็จ");
      navigate("/"); // เด้งไปหน้า home
    } else {
      setMessage("❌ ไม่พบผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();

    // กัน email ซ้ำ
    const existed = users.find((u) => u.email === email);
    if (existed) {
      setMessage("❌ อีเมลนี้มีในระบบแล้ว");
      return;
    }

    if (password !== confirm) {
      setMessage("❌ Password กับ Current Password ไม่ตรงกัน");
      return;
    }

    const newUser: StoredUser = {
      email,
      phone,
      password,
    };

    const nextUsers: StoredUser[] = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(nextUsers));
    setMessage("✅ สมัครสำเร็จแล้ว ลอง Login ได้เลย");
    setMode("login");
    setPassword("");
    setConfirm("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#d9d9d9]">
      <Header />

      <div className="flex flex-1 items-center justify-center py-12">
        <div className="w-[440px] rounded-[28px] bg-[#d9d9d9] p-10 shadow-[10px_10px_22px_rgba(0,0,0,0.25),-10px_-10px_22px_rgba(255,255,255,0.7)]">
          <h1 className="text-center text-4xl font-bold text-slate-700 drop-shadow-sm mb-8">
            {mode === "login" ? "Login" : "Register"}
          </h1>

          {mode === "login" ? (
            <form className="space-y-6" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Email / Phone Number"
                className="w-full rounded-full bg-[#d9d9d9] px-5 py-3 text-[15px] text-slate-700 shadow-inner outline-none border border-transparent focus:border-slate-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-full bg-[#d9d9d9] px-5 py-3 text-[15px] text-slate-700 shadow-inner outline-none border border-transparent focus:border-slate-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                className="mx-auto block rounded-full bg-[#d9d9d9] px-10 py-2.5 text-base font-semibold text-slate-700 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.15),inset_-2px_-2px_6px_rgba(255,255,255,0.6)] hover:brightness-105"
              >
                Login
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleRegister}>
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-full bg-[#d9d9d9] px-5 py-3 text-[15px] text-slate-700 shadow-inner outline-none border border-transparent focus:border-slate-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-full bg-[#d9d9d9] px-5 py-3 text-[15px] text-slate-700 shadow-inner outline-none border border-transparent focus:border-slate-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Current Password"
                className="w-full rounded-full bg-[#d9d9d9] px-5 py-3 text-[15px] text-slate-700 shadow-inner outline-none border border-transparent focus:border-slate-300"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full rounded-full bg-[#d9d9d9] px-5 py-3 text-[15px] text-slate-700 shadow-inner outline-none border border-transparent focus:border-slate-300"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <button
                type="submit"
                className="mx-auto block rounded-full bg-[#d9d9d9] px-10 py-2.5 text-base font-semibold text-slate-700 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.15),inset_-2px_-2px_6px_rgba(255,255,255,0.6)] hover:brightness-105"
              >
                Register
              </button>
            </form>
          )}

          {message && (
            <p className="mt-4 text-center text-sm text-slate-600">{message}</p>
          )}

          <div className="mt-6 text-center text-sm">
            {mode === "login" ? (
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setMessage("");
                }}
                className="font-semibold text-red-700 hover:text-red-800"
              >
                Register
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setMessage("");
                }}
                className="font-semibold text-red-700 hover:text-red-800"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
