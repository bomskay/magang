"use client";

import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";

const Footer = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push("/"); // arahkan ke halaman login setelah logout
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  return (
    <footer className="bg-blue-200 text-black py-4 shadow-inner w-full">
  <div className="w-full mx-auto px-4 flex items-center justify-between">
    
    {/* Kiri: Teks atas-bawah */}
    <div className="flex flex-col">
      <p className="text-sm">&copy; 2025 Biro Pemerintahan dan Otonomi Daerah. All rights reserved.</p>
      <p className="text-sm">Created by : Andrew Tombokan Nathan Matindas Highland Sirappa.</p>
    </div>
  </div>
</footer>
  );
};

export default Footer;
