"use client";

import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Arsip</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/dashboard" className="hover:text-blue-300">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/profil" className="hover:text-blue-300">
                Profil
              </Link>
            </li>
            <li>
              <Link href="/settings" className="hover:text-blue-300">
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
