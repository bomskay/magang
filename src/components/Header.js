"use client";

import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-white-600 text-black py-4 shadow-md">
      <div className="w-full mx-auto px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Arsip Surat Biro Pemerintahan</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/dashboard" className="hover:text-gray-300">
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
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
