"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";

const Header = () => {
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
    <header className="bg-blue-200 text-black py-4 shadow-md">
      <div className="w-full mx-auto px-4 flex items-center justify-between h-10">
        <Link href="/dashboard" className="text-2xl font-bold">Biro Pemerintahan dan Otonomi Daerah</Link>
        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <Link href="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/inputSuratMasuk" className="hover:text-gray-300">
                Input Surat
              </Link>
            </li>
            <li>
              <Link href="/daftarSurat" className="hover:text-gray-300">
                Daftar Surat
              </Link>
            </li>
            <button onClick={handleLogout} className="text-black-600 px-4 py-2 rounded hover:bg-blue-300 border border-black text-sm ">
              Logout
            </button>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
