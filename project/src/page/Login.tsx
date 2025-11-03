import React, { useState } from "react";
import Header from "../components/home/Header";
import Footer from "../components/home/Footer";

const LoginRegisterPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen flex flex-col bg-[#d9d9d9]">
      {/* Header */}
      <Header />

        {/* ส่วนกลางของหน้า */}
        <div className="flex flex-1 items-center justify-center py-12">
            <div className="w-[440px] rounded-[28px] bg-[#d9d9d9] p-10 shadow-[10px_10px_22px_rgba(0,0,0,0.25),-10px_-10px_22px_rgba(255,255,255,0.7)]">
            {/* Title */}
            <h1 className="text-center text-4xl font-bold text-slate-700 drop-shadow-sm mb-8">
                {mode === "login" ? "Login" : "Register"}
            </h1>

            {mode === "login" ? (
                <form className="space-y-6">
                <input
                    type="text"
                    placeholder="Email / Phone Number"
                    className="w-full rounded-full bg-[#d9d9d9] px-5 py-3 text-[15px] text-slate-700 shadow-inner outline-none border border-transparent focus:border-slate-300"/>

                <div>
                    <input type="password" placeholder="Password"
                    className="w-full rounded-full bg-[#d9d9d9] px-5 py-3 text-[15px] text-slate-700 shadow-inner outline-none border border-transparent focus:border-slate-300"/>
                    <div className="flex justify-end mt-1">
                    <button type="button" className="text-[12px] text-slate-500 hover:text-slate-700">
                        For got Password
                    </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="mx-auto block rounded-full bg-[#d9d9d9] px-10 py-2.5 text-base font-semibold text-slate-700 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.15),inset_-2px_-2px_6px_rgba(255,255,255,0.6)] hover:brightness-105"
                >
                    Login
                </button>
                </form>
            ) : (
                <form className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-full bg-[#d9d9d9] px-5 py-3 text-[15px] text-slate-700 shadow-inner outline-none border border-transparent focus:border-slate-300"/>
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full rounded-full bg-[#d9d9d9] px-5 py-3 text-[15px] text-slate-700 shadow-inner outline-none border border-transparent focus:border-slate-300"/>
                <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full rounded-full bg-[#d9d9d9] px-5 py-3 text-[15px] text-slate-700 shadow-inner outline-none border border-transparent focus:border-slate-300"/>
                <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full rounded-full bg-[#d9d9d9] px-5 py-3 text-[15px] text-slate-700 shadow-inner outline-none border border-transparent focus:border-slate-300"/>

                <button
                    type="submit"
                    className="mx-auto block rounded-full bg-[#d9d9d9] px-10 py-2.5 text-base font-semibold text-slate-700 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.15),inset_-2px_-2px_6px_rgba(255,255,255,0.6)] hover:brightness-105"
                >
                    Register
                </button>
                </form>
            )}

            {/* Switch */}
            <div className="mt-6 text-center text-sm">
                {mode === "login" ? (
                <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-semibold text-red-700 hover:text-red-800"
                >
                    Register
                </button>
                ) : (
                <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-semibold text-red-700 hover:text-red-800"
                >
                    Login
                </button>
                )}
            </div>
            </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LoginRegisterPage;
