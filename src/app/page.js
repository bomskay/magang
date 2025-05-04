// app/page.js
"use client"; // Menandakan bahwa komponen ini hanya dijalankan di sisi client

import React from "react";
import LoginForm from "@/components/loginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-300 px-4">
      <LoginForm /> {/* Memanggil komponen LoginForm */}
    </div>
  );
};

export default LoginPage;
