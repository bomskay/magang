// app/dashboard/page.js
"use client";

import React, { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="py-12 px-4">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Selamat datang di Dashboard, {user.email}
        </h2>
        {/* Konten Dashboard lainnya */}
        <div className="mt-4 text-center text-gray-400">
          Ini adalah area dashboard dengan tema gelap.
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
