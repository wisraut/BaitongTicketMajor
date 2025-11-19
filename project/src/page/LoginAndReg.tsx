import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/base/Header";
import Footer from "../components/base/Footer";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

const LoginAndReg: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e6ecf1]">
      <Header />

      {/* ตรงกลางหน้า */}
      <main className="flex-1 flex py-10 justify-center items-center">
        {mode === "login" ? (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitch={() => setMode("register")}
          />
        ) : (
          <RegisterForm onSwitch={() => setMode("login")} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default LoginAndReg;
