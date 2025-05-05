"use client";
import React, { useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth"; // Import metode untuk memantau status autentikasi
import { useRouter } from "next/navigation";
import DaftarSurat from "@/components/daftarSurat";

const daftarSurat = () => {
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

  
  return (
    <div className="min-h-screen bg-white text-black">
      <DaftarSurat />
    </div>
  );
};

export default daftarSurat;
