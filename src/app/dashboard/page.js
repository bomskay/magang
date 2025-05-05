// app/dashboard/page.js
"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth"; // Import metode untuk memantau status autentikasi
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import UpdateSurat from "@/components/updateSurat";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Memantau perubahan status autentikasi
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user jika ada yang login
      } else {
        router.push("/"); // Redirect ke halaman login jika belum login
      }
    });

    // Bersihkan listener saat komponen unmount
    return () => unsubscribe();
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      
    </div>
  );
};

export default Dashboard;
